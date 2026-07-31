import crypto from "crypto";

// ──────────────────────────────────────────────────────────────────────────────
// lib/auth.ts — Secure session token utility for Millennium admin auth
//
// Tokens are HMAC-SHA256 signed payloads with expiry. No external deps needed.
// The signing key is ADMIN_SESSION_SECRET env var (falls back to NEXTAUTH_SECRET).
// ──────────────────────────────────────────────────────────────────────────────

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSigningKey(): string {
  const key = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!key) {
    throw new Error("ADMIN_SESSION_SECRET or NEXTAUTH_SECRET env var is required");
  }
  return key;
}

/** Hash a password with scrypt + random salt. Returns "salt:hash" */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/** Compare a plaintext password against a "salt:hash" stored value */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      try {
        resolve(
          crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey)
        );
      } catch {
        resolve(false);
      }
    });
  });
}

export interface SessionPayload {
  email: string;
  role: string;
  iat: number; // issued-at timestamp
  exp: number; // expiry timestamp
}

/** Create a signed session token */
export function createSessionToken(email: string, role: string): string {
  const payload: SessionPayload = {
    email,
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSigningKey())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/** Verify and decode a session token. Returns null if invalid or expired. */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;

    // Recompute HMAC and compare with timing-safe equality
    const expectedSig = crypto
      .createHmac("sha256", getSigningKey())
      .update(payloadB64)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature, "base64url");
    const expectedBuffer = Buffer.from(expectedSig, "base64url");

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    // Check expiry
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Cookie name for admin sessions */
export const ADMIN_COOKIE_NAME = "millennium_admin_session";

/** Build a Set-Cookie header value for the admin session */
export function buildSessionCookie(token: string): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

/** Build a cookie that clears the session */
export function buildClearSessionCookie(): string {
  return `${ADMIN_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

/** Extract session token from request cookies */
export function getSessionFromRequest(request: Request): SessionPayload | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith(`${ADMIN_COOKIE_NAME}=`));
  if (!sessionCookie) return null;

  const token = sessionCookie.split("=")[1];
  if (!token) return null;

  return verifySessionToken(token);
}

/** Generate a cryptographically secure random ID */
export function secureId(prefix: string = ""): string {
  const hex = crypto.randomBytes(6).toString("hex").toUpperCase();
  return prefix ? `${prefix}-${hex}` : hex;
}

/** Generate a secure order number */
export function secureOrderNumber(prefix: string = "RET"): string {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${year}-${hex}`;
}
