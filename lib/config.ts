import { APP_NAME } from "@/lib/constants";

export const config = {
  appName: APP_NAME,
  environment: process.env.NODE_ENV || "development",
  apiUrl: process.env.NEXT_PUBLIC_API_BASE || "/api",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "development-insecure-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  refreshTokenExpiresInDays: Number(
    process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || "30",
  ),
  encryptionKey:
    process.env.ENCRYPTION_KEY || "01234567890123456789012345678901",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    fromName: process.env.SMTP_FROM_NAME || APP_NAME,
  },
  roblox: {
    cloudBase: process.env.ROBLOX_API_BASE || "https://apis.roblox.com",
    groupsBase:
      process.env.ROBLOX_GROUP_API || "https://groups.roblox.com",
  },
  abacus: {
    apiKey: process.env.ABACUS_AI_API_KEY,
    baseUrl:
      process.env.ABACUS_AI_BASE_URL || "https://routellm.abacus.ai/v1",
    model: process.env.ABACUS_AI_MODEL || "gemini-3-flash-preview",
  },
};
