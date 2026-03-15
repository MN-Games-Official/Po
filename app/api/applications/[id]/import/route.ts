import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { serializeApplication } from "@/lib/serializers";
import { questionSchema } from "@/lib/validation";
import { z } from "zod";

const importSchema = z.object({
  mode: z.enum(["replace", "merge"]),
  questions: z.array(questionSchema),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = importSchema.parse(await request.json());

    const application = await db.application.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!application) {
      return fail("Application not found.", "APPLICATION_NOT_FOUND", 404);
    }

    const currentQuestions = JSON.parse(application.questionsJson) as Array<unknown>;
    const mergedQuestions =
      body.mode === "replace" ? body.questions : [...currentQuestions, ...body.questions];

    const updated = await db.application.update({
      where: { id: params.id },
      data: {
        questionsJson: JSON.stringify(mergedQuestions),
      },
    });

    return ok({
      application: serializeApplication(updated),
    });
  } catch (error) {
    return fail("Unable to import questions.", "APPLICATION_IMPORT_FAILED", 400, error);
  }
}
