import { fail, ok } from "@/lib/route";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return fail("Verification token is missing.", "TOKEN_MISSING", 400);
  }

  const record = await db.emailVerification.findUnique({
    where: { token },
  });

  if (!record || record.used) {
    return fail("Verification token is invalid.", "TOKEN_INVALID", 400);
  }

  if (record.expiresAt < new Date()) {
    return fail("Verification token has expired.", "TOKEN_EXPIRED", 400);
  }

  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
    db.emailVerification.update({
      where: { token },
      data: {
        used: true,
      },
    }),
  ]);

  return ok({
    message: "Email verified. You can now sign in.",
  });
}

