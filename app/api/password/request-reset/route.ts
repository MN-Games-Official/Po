import { createOpaqueToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { ok } from "@/lib/route";
import { forgotPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = forgotPasswordSchema.parse(await request.json());

  const user = await db.user.findUnique({
    where: { email: body.email },
  });

  if (user) {
    const token = createOpaqueToken();
    await db.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    await sendPasswordResetEmail(user.email, token);
  }

  return ok({
    message: "If the account exists, a reset link has been sent.",
  });
}

