import { NextResponse } from "next/server";
import { createSessionToken, buildSessionCookie, verifyPassword } from "../../../../lib/auth";
import { rateLimitResponse } from "../../../../lib/rateLimit";
import { safeErrorResponse } from "../../../../lib/apiAuth";

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/admin-login
//
// Verifies admin credentials against env vars:
//   ADMIN_EMAIL (default: admin@millenniumfurniture.in)
//   ADMIN_PASSWORD_HASH (scrypt hash — generate with lib/auth.ts hashPassword)
//   ADMIN_PASSWORD (plaintext fallback for dev — NOT recommended for production)
//
// Returns a signed HttpOnly session cookie on success.
// Rate limited to 5 attempts per 15 minutes per IP.
// ──────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Rate limit: 5 attempts per 15 minutes
  const limited = rateLimitResponse(request, { windowMs: 15 * 60 * 1000, max: 5 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@millenniumfurniture.in";
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPasswordPlain = process.env.ADMIN_PASSWORD;

    // Check email match (case-insensitive)
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      // Generic error to prevent email enumeration
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    let isValidPassword = false;

    if (adminPasswordHash) {
      // Production: verify against scrypt hash
      isValidPassword = await verifyPassword(password, adminPasswordHash);
    } else if (adminPasswordPlain) {
      // Dev fallback: compare plaintext (NOT for production)
      isValidPassword = password === adminPasswordPlain;
    } else {
      // No password configured — reject all logins with guidance
      return NextResponse.json(
        { success: false, error: "Admin password not configured. Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH env var." },
        { status: 503 }
      );
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create signed session token and set HttpOnly cookie
    const token = createSessionToken(adminEmail, "ADMIN");
    const cookie = buildSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
      user: { email: adminEmail, role: "ADMIN" },
    });

    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    return safeErrorResponse(error, "Authentication failed");
  }
}
