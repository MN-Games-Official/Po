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
  // Log all errors for debugging
  if (details) {
    const detailsObj = details instanceof Error 
      ? { message: details.message, stack: details.stack }
      : details;
    logger.error(error, detailsObj as Record<string, unknown> | undefined);
  } else {
    logger.error(error, { code, status });
  }

  return NextResponse.json({ success: false, error, code }, { status });
}
