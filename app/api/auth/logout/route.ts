import { NextResponse } from "next/server";

import {
  clearAuthCookies,
  revokeRefreshToken,
} from "@/lib/auth";
import { REFRESH_TOKEN_COOKIE } from "@/lib/constants";
import { ok } from "@/lib/route";

export async function POST(request: Request) {
  const refreshToken = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFRESH_TOKEN_COOKIE}=`))
    ?.split("=")[1];

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  const response = ok({ message: "Signed out." }) as NextResponse;
  clearAuthCookies(response);
  return response;
}

