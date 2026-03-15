# Polaris Pilot

Internal admin portal for Polaris Pilot, built with Next.js 14 App Router, React, TypeScript, Tailwind CSS, Prisma, MySQL, JWT auth, Roblox Cloud integrations, and Abacus AI-assisted form generation.

## What is implemented

- Auth flows: sign up, login, email verification, password reset, logout, refresh token rotation
- Dashboard shell: responsive sidebar, header, overview stats, activity feed, quick actions
- Application Center: list, create, edit, AI question generation, question import, live preview
- Rank Center: list, create, edit, rank entry management, live preview
- API Keys: Roblox key storage/validation, Polaris scoped key generation, encrypted persistence
- Profile: profile editing and password rotation
- Submission grading: objective grading, AI short-answer grading, Roblox promotion attempt, submission storage
- Deployment support: Prisma schema, `.env.example`, `vercel.json`, production build verified

## Stack

- `next` 14
- `react` 18
- `typescript`
- `tailwindcss`
- `react-hook-form` + `zod`
- `prisma` + `@prisma/client`
- `jsonwebtoken`
- `bcryptjs`
- `nodemailer`

## Local setup

```bash
npm install
npx prisma generate
cp .env.example .env.local
```

Populate `.env.local`, then:

```bash
npm run type-check
npm run build
npm run dev
```

## Environment

Use `.env.example` as the source of truth for:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN_DAYS`
- `SMTP_*`
- `ROBLOX_*`
- `ABACUS_AI_*`
- `ENCRYPTION_KEY`
- `NEXT_PUBLIC_APP_URL`

## Notes

- The dashboard routes are under `/dashboard/*`.
- Prisma uses camelCase fields mapped onto snake_case MySQL columns.
- Roblox API key validation is intentionally lightweight and should be tightened against your exact production permission model.
- Abacus AI routes fall back to deterministic generation/grading behavior if the AI API key is missing.
- The build succeeds in this workspace. Next emitted warnings about attempting to patch missing SWC lockfile metadata; the build still completed successfully.
