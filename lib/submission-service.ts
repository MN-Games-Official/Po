import { db } from "@/lib/db";
import { batchGradeShortAnswers } from "@/lib/ai-service";
import { decryptKey } from "@/lib/encryption";
import { RobloxService } from "@/lib/roblox-service";
import { parseJson } from "@/lib/utils";
import type { Question, SubmissionBreakdown } from "@/types/domain";

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
}

export async function gradeSubmission(input: {
  appId: string;
  applicantId: string;
  membershipId?: string;
  answers: Record<string, string | number | boolean>;
}) {
  const application = await db.application.findUnique({
    where: { id: input.appId },
    include: {
      user: true,
    },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  const questions = parseJson<Question[]>(application.questionsJson, []);
  const shortAnswerQuestions = questions.filter(
    (question) => question.type === "short_answer",
  );

  const shortAnswerResults =
    shortAnswerQuestions.length > 0
      ? await batchGradeShortAnswers(
          shortAnswerQuestions.map((question) => ({
            id: question.id,
            question: question.text,
            answer: String(input.answers[question.id] || ""),
            max_score: question.max_score,
            criteria: question.grading_criteria,
          })),
        )
      : [];

  const shortAnswerMap = new Map(
    shortAnswerResults.map((item) => [item.id, item]),
  );

  let score = 0;
  let maxScore = 0;
  const breakdown: Record<string, SubmissionBreakdown> = {};

  for (const question of questions) {
    maxScore += question.max_score;
    const answer = input.answers[question.id];

    if (question.type === "multiple_choice") {
      const correct = Number(answer) === Number(question.correct_answer);
      score += correct ? question.max_score : 0;
      breakdown[question.id] = {
        type: question.type,
        score: correct ? question.max_score : 0,
        max_score: question.max_score,
        feedback: correct ? "Correct" : "Incorrect",
      };
      continue;
    }

    if (question.type === "true_false") {
      const correct =
        normalizeBoolean(answer) === normalizeBoolean(question.correct_answer);
      score += correct ? question.max_score : 0;
      breakdown[question.id] = {
        type: question.type,
        score: correct ? question.max_score : 0,
        max_score: question.max_score,
        feedback: correct ? "Correct" : "Incorrect",
      };
      continue;
    }

    const graded = shortAnswerMap.get(question.id);
    const awarded = Math.min(question.max_score, graded?.score || 0);
    score += awarded;
    breakdown[question.id] = {
      type: question.type,
      score: awarded,
      max_score: question.max_score,
      feedback: graded?.feedback || "No rubric feedback returned.",
    };
  }

  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const passed = percentage >= application.passScore;

  let promotion:
    | {
        success: boolean;
        group_id: string;
        target_role: string;
        message: string;
      }
    | undefined;
  let promotionStatus = "not_attempted";

  if (passed) {
    const robloxKey = await db.apiKey.findFirst({
      where: {
        userId: application.userId,
        type: "roblox",
        isActive: true,
      },
    });

    if (robloxKey) {
      try {
        const service = new RobloxService(decryptKey(robloxKey.encryptedKey));
        const membership =
          input.membershipId ||
          (await service
            .getMembership(application.groupId, input.applicantId)
            .then((value) => value?.path?.split("/").pop() || null));

        if (!membership) {
          throw new Error("Membership record not found for applicant.");
        }

        await service.promoteUser(
          application.groupId,
          membership,
          application.targetRole,
        );
        promotionStatus = "success";
        promotion = {
          success: true,
          group_id: application.groupId,
          target_role: application.targetRole,
          message: "Applicant promoted successfully.",
        };
      } catch (error) {
        promotionStatus = "failed";
        promotion = {
          success: false,
          group_id: application.groupId,
          target_role: application.targetRole,
          message:
            error instanceof Error
              ? error.message
              : "Promotion failed unexpectedly.",
        };
      }
    } else {
      promotionStatus = "failed";
      promotion = {
        success: false,
        group_id: application.groupId,
        target_role: application.targetRole,
        message: "No active Roblox API key is configured for this account.",
      };
    }
  }

  const submission = await db.applicationSubmission.create({
    data: {
      applicationId: application.id,
      robloxUserId: input.applicantId,
      membershipId: input.membershipId || null,
      answersJson: JSON.stringify(input.answers),
      score,
      maxScore,
      passed,
      feedback: Object.values(breakdown)
        .map((item) => item.feedback)
        .join(" | "),
      promotionStatus,
    },
  });

  return {
    submission,
    application,
    passed,
    total_score: score,
    max_score: maxScore,
    percentage,
    breakdown,
    promotion,
  };
}
