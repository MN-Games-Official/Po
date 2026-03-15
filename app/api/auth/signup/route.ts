import { createOpaqueToken, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";
import { fail, ok } from "@/lib/route";
import { serializeUser } from "@/lib/serializers";
import { signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = signupSchema.parse(await request.json());

    const [existingEmail, existingUsername] = await Promise.all([
      db.user.findUnique({ where: { email: body.email } }),
      db.user.findUnique({ where: { username: body.username } }),
    ]);

    if (existingEmail) {
      return fail("Email is already registered.", "EMAIL_TAKEN", 409);
    }

    if (existingUsername) {
      return fail("Username is already taken.", "USERNAME_TAKEN", 409);
    }

    const passwordHash = await hashPassword(body.password);
    const verificationToken = createOpaqueToken();
    const verificationExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const user = await db.user.create({
      data: {
        email: body.email,
        username: body.username,
        passwordHash,
        fullName: body.full_name,
      },
    });

    await db.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: verificationExpiry,
      },
    });

    await sendVerificationEmail(user.email, verificationToken);

    return ok(
      {
        message: "Account created. Please verify your email.",
        user: serializeUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    return fail("Unable to create account.", "SIGNUP_FAILED", 400, error);
  }
}

