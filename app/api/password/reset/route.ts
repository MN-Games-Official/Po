import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = resetPasswordSchema.parse(await request.json());

  const record = await db.passwordReset.findUnique({
    where: { token: body.token },
  });

  if (!record || record.used) {
    return fail("Reset token is invalid.", "TOKEN_INVALID", 400);
  }

  if (record.expiresAt < new Date()) {
    return fail("Reset token has expired.", "TOKEN_EXPIRED", 400);
  }

  const passwordHash = await hashPassword(body.new_password);

  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: {
        passwordHash,
      },
    }),
    db.passwordReset.update({
      where: { token: body.token },
      data: {
        used: true,
      },
    }),
    db.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  return ok({
    message: "Password has been reset.",
  });
}
