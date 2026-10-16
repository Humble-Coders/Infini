import "server-only";

import { NextRequest } from "next/server";

/**
 * Validates that an incoming state-changing request (POST, PUT, PATCH, DELETE)
 * originates from the application's own host and is not a cross-site forgery attack.
 */
export function isAllowedOrigin(request: NextRequest | Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite === "cross-site") {
      return false;
    }
    return true;
  }
  const host = request.headers.get("host");
  try {
    const originUrl = new URL(origin);
    return Boolean(host && originUrl.host === host);
  } catch {
    return false;
  }
}
