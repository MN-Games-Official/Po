import { NextResponse } from "next/server";

import {
  attachAuthCookies,
  issueRefreshToken,
  signAccessToken,
  toSessionUser,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());

    const user = await db.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return fail("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    }

    const passwordValid = await verifyPassword(body.password, user.passwordHash);
    if (!passwordValid) {
      return fail("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    }

    if (!user.emailVerified) {
      return fail(
        "Verify your email before signing in.",
        "EMAIL_NOT_VERIFIED",
        403,
      );
    }

    const sessionUser = toSessionUser(user);
    const accessToken = signAccessToken(sessionUser);
    const refreshToken = await issueRefreshToken(user.id);
    const response = ok({
      user: sessionUser,
      access_token: accessToken,
    }) as NextResponse;

    attachAuthCookies(
      response,
      accessToken,
      refreshToken.token,
      refreshToken.expiresAt,
    );

    return response;
  } catch (error) {
    return fail("Unable to sign in.", "LOGIN_FAILED", 400, error);
  }
}

