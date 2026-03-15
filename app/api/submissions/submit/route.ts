import { fail, ok } from "@/lib/route";
import { gradeSubmission } from "@/lib/submission-service";
import { submissionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = submissionSchema.parse(await request.json());
    const result = await gradeSubmission({
      appId: body.app_id,
      applicantId: String(body.applicant_id),
      membershipId: body.membership_id ? String(body.membership_id) : undefined,
      answers: body.answers,
    });

    return ok({
      passed: result.passed,
      total_score: result.total_score,
      max_score: result.max_score,
      percentage: result.percentage,
      breakdown: result.breakdown,
      promotion: result.promotion,
      submission_id: result.submission.id,
    });
  } catch (error) {
    return fail("Unable to submit application.", "SUBMISSION_FAILED", 400, error);
  }
}

