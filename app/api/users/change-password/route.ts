import {
  hashPassword,
  requireAuthenticatedUser,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { changePasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = changePasswordSchema.parse(await request.json());

    const passwordValid = await verifyPassword(
      body.current_password,
      user.passwordHash,
    );

    if (!passwordValid) {
      return fail("Current password is incorrect.", "PASSWORD_INVALID", 400);
    }

    const newHash = await hashPassword(body.new_password);

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
        },
      }),
      db.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);

    return ok({
      message: "Password updated.",
    });
  } catch (error) {
    return fail("Unable to change password.", "PASSWORD_CHANGE_FAILED", 400, error);
  }
}
