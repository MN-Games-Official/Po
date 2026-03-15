import { requireAuthenticatedUser } from "@/lib/auth";
import { generateApplicationWithAi } from "@/lib/ai-service";
import { fail, ok } from "@/lib/route";
import { applicationGenerationSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAuthenticatedUser(request);
    const body = applicationGenerationSchema.parse(await request.json());
    const generated = await generateApplicationWithAi(body);

    return ok({
      application_id: params.id,
      questions: generated.form?.questions || [],
    });
  } catch (error) {
    return fail("Unable to generate application questions.", "APPLICATION_GENERATE_FAILED", 400, error);
  }
}

