import { NextResponse } from "next/server";

import { attachAuthCookies, rotateRefreshToken, signAccessToken } from "@/lib/auth";
import { REFRESH_TOKEN_COOKIE } from "@/lib/constants";
import { fail, ok } from "@/lib/route";

function getRefreshToken(request: Request) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFRESH_TOKEN_COOKIE}=`))
    ?.split("=")[1];
}

export async function POST(request: Request) {
  const rawToken = getRefreshToken(request);
  if (!rawToken) {
    return fail("Refresh token missing.", "REFRESH_MISSING", 401);
  }

  const rotated = await rotateRefreshToken(rawToken);
  if (!rotated) {
    return fail("Refresh token invalid or expired.", "REFRESH_INVALID", 401);
  }

  const accessToken = signAccessToken(rotated.user);
  const response = ok({
    user: rotated.user,
    access_token: accessToken,
  }) as NextResponse;

  attachAuthCookies(
    response,
    accessToken,
    rotated.refreshToken.token,
    rotated.refreshToken.expiresAt,
  );

  return response;
}

