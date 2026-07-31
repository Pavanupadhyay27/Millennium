import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./auth";

// ──────────────────────────────────────────────────────────────────────────────
// lib/apiAuth.ts — API route authentication guard
//
// Usage in any API route:
//   const authError = requireAdmin(request);
//   if (authError) return authError;
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Require a valid admin session. Returns a 401 NextResponse if unauthorized,
 * or null if the session is valid.
 */
export function requireAdmin(request: Request): NextResponse | null {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  if (session.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Require any valid session (admin or customer).
 * Returns a 401 NextResponse if unauthorized, or null if valid.
 */
export function requireAuth(request: Request): NextResponse | null {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Sanitize a string for safe HTML interpolation (prevents XSS in emails).
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Build a safe error response that never leaks internal details.
 * Logs the real error server-side.
 */
export function safeErrorResponse(
  error: unknown,
  publicMessage: string = "An internal error occurred. Please try again.",
  status: number = 500
): NextResponse {
  console.error("[API Error]", error);
  return NextResponse.json(
    { success: false, error: publicMessage },
    { status }
  );
}
