import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(
  error: string,
  code = "REQUEST_FAILED",
  status = 400,
  details?: unknown,
) {
  if (status >= 500) {
    logger.error(error, details as Record<string, unknown> | undefined);
  }

  return NextResponse.json({ success: false, error, code }, { status });
}
