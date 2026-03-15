import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { z } from "zod";

const regenerateSchema = z.object({
  id: z.number(),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = regenerateSchema.parse(await request.json());

    const key = await db.apiKey.findFirst({
      where: {
        id: body.id,
        userId: user.id,
        type: "polaris",
      },
    });

    if (!key) {
      return fail("API key not found.", "API_KEY_NOT_FOUND", 404);
    }

    await db.apiKey.update({
      where: { id: key.id },
      data: { isActive: false },
    });

    return ok({
      message: "API key revoked. Generate a new one from the dashboard.",
    });
  } catch (error) {
    return fail("Unable to regenerate API key.", "API_KEY_REGENERATE_FAILED", 400, error);
  }
}
