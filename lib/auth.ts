import { randomBytes } from "crypto";

import type { User } from "@prisma/client/index";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

import { config } from "@/lib/config";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_HEADER_PREFIX,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/constants";
import { db } from "@/lib/db";
import { hashOpaqueToken } from "@/lib/encryption";
import { logger } from "@/lib/logger";
import type { SessionUser } from "@/types/domain";

type AccessTokenPayload = {
  sub: string;
  email: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email_verified: boolean;
};

type MinimalUser = Pick<
  User,
  "id" | "email" | "username" | "fullName" | "avatarUrl" | "emailVerified"
>;

export function toSessionUser(user: MinimalUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.fullName,
    avatar_url: user.avatarUrl,
    email_verified: user.emailVerified,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(user: SessionUser) {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      email_verified: user.email_verified,
    } satisfies AccessTokenPayload,
    config.jwtSecret,
    options,
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AccessTokenPayload;
}

export function createOpaqueToken() {
  return randomBytes(48).toString("hex");
}

export async function issueRefreshToken(userId: number) {
  const token = createOpaqueToken();
  const expiresAt = new Date(
    Date.now() + config.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
  );

  await db.refreshToken.create({
    data: {
      userId,
      tokenHash: hashOpaqueToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function rotateRefreshToken(rawToken: string) {
  const tokenHash = hashOpaqueToken(rawToken);
  const record = await db.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    return null;
  }

  await db.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });

  const refreshToken = await issueRefreshToken(record.userId);
  return {
    user: toSessionUser(record.user),
    refreshToken,
  };
}

export async function revokeRefreshToken(rawToken: string) {
  try {
    await db.refreshToken.update({
      where: { tokenHash: hashOpaqueToken(rawToken) },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    logger.warn("Refresh token revoke failed", error as Error);
  }
}

export function attachAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  refreshExpiresAt: Date,
) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: refreshExpiresAt,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export function getAccessTokenFromRequest(request: NextRequest | Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith(AUTH_HEADER_PREFIX)) {
    return authHeader.slice(AUTH_HEADER_PREFIX.length);
  }

  if ("cookies" in request && typeof request.cookies.get === "function") {
    return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || null;
  }

  return null;
}

export async function getAuthenticatedUser(request: NextRequest | Request) {
  const token = getAccessTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    const payload = verifyAccessToken(token);
    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) {
      return null;
    }

    return db.user.findUnique({
      where: { id: userId },
    });
  } catch {
    return null;
  }
}

export async function requireAuthenticatedUser(request: NextRequest | Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function getSessionUserFromCookies() {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const payload = verifyAccessToken(token);
    return {
      id: Number(payload.sub),
      email: payload.email,
      username: payload.username,
      full_name: payload.full_name,
      avatar_url: payload.avatar_url,
      email_verified: payload.email_verified,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}
