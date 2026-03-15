import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
import { applicationGenerationSchema } from "@/lib/validation";
import type { Question } from "@/types/domain";
import { z } from "zod";

function extractJson<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("The AI provider returned non-JSON content.");
  }

  return JSON.parse(match[0]) as T;
}

export async function generateApplicationWithAi(
  input: z.infer<typeof applicationGenerationSchema>,
) {
  if (!config.abacus.apiKey) {
    logger.warn(
      "ABACUS_AI_API_KEY is not configured; using deterministic fallback.",
    );

    return {
      form: {
        questions: Array.from({ length: input.questions_count }).map(
          (_, index) => {
            const isShort = index === 1;

            if (isShort) {
              return {
                id: `generated-short-${index}`,
                type: "short_answer" as const,
                text: `Explain how you would represent the ${input.rank} role professionally in group ${input.group_id}.`,
                max_score: 10,
                grading_criteria:
                  "Mentions professionalism, policy enforcement, and player respect.",
              };
            }

            return {
              id: `generated-${index}`,
              type:
                index % 2 === 0
                  ? ("multiple_choice" as const)
                  : ("true_false" as const),
              text:
                index % 2 === 0
                  ? `Which response best fits a ${input.vibe} application for rank ${input.rank}?`
                  : "Staff should always document moderation decisions for review.",
              options:
                index % 2 === 0
                  ? [
                      "Aggressive tone",
                      "Clear policy-led answer",
                      "Avoid all detail",
                      "Ask for Robux",
                    ]
                  : undefined,
              correct_answer: index % 2 === 0 ? 1 : true,
              max_score: 10,
            };
          },
        ),
      },
    };
  }

  const prompt = `
You are an expert form designer for Roblox group applications.
Return only valid JSON.

Build a ${input.questions_count}-question form.
Name: ${input.name}
Description: ${input.description || "None"}
Target Group: ${input.group_id}
Target Rank: ${input.rank}
Tone: ${input.vibe}
Primary Color: ${input.primary_color}
Secondary Color: ${input.secondary_color}
Extra Instructions: ${input.instructions || "None"}

Rules:
- Use question types multiple_choice, short_answer, and true_false.
- Use at most 3 short_answer questions.
- Each question must have id, type, text, max_score.
- multiple_choice needs options and numeric correct_answer.
- true_false needs boolean correct_answer.
- short_answer may include grading_criteria.

JSON shape:
{
  "form": {
    "questions": [...]
  }
}`;

  const response = await fetch(`${config.abacus.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.abacus.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.abacus.model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI provider returned an empty response.");
  }

  return extractJson<{ form?: { questions?: Question[] } }>(content);
}

export async function batchGradeShortAnswers(
  items: Array<{
    id: string;
    question: string;
    answer: string;
    max_score: number;
    criteria?: string;
  }>,
) {
  if (!config.abacus.apiKey) {
    return items.map((item) => ({
      id: item.id,
      score: Math.min(item.max_score, Math.max(4, item.answer.length / 20)),
      feedback: "Fallback rubric used because AI grading is not configured.",
    }));
  }

  const prompt = `
You are an objective grader for Roblox group applications.
Return only valid JSON.

${items
  .map(
    (item, index) => `
ITEM ${index}
id: ${item.id}
max_score: ${item.max_score}
question: ${item.question}
answer: ${item.answer}
criteria: ${item.criteria || "None"}
`,
  )
  .join("\n")}

Output:
{
  "results": [
    { "id": "example", "score": 8.5, "feedback": "..." }
  ]
}`;

  const response = await fetch(`${config.abacus.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.abacus.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.abacus.model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      temperature: 0.4,
      max_tokens: 1600,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI grading failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI grading returned empty content.");
  }

  const parsed = extractJson<{
    results?: Array<{ id: string; score: number; feedback: string }>;
  }>(content);

  return parsed.results || [];
}
