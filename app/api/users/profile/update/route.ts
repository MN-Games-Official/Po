import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { serializeUser } from "@/lib/serializers";
import { profileUpdateSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = profileUpdateSchema.parse(await request.json());
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        fullName: body.full_name || null,
        avatarUrl: body.avatar_url || null,
      },
    });

    return ok({
      user: serializeUser(updated),
    });
  } catch (error) {
    return fail("Unable to update profile.", "PROFILE_UPDATE_FAILED", 400, error);
  }
}

