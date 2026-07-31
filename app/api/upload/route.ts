import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/apiAuth";
import { rateLimitResponse } from "../../../lib/rateLimit";
import { safeErrorResponse } from "../../../lib/apiAuth";

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/upload — Secure file upload with type/size validation (H3 fix)
//
// Requires admin authentication.
// Only allows image files (JPEG, PNG, WebP, GIF) up to 5MB.
// Validates both MIME type and file signature (magic bytes).
// ──────────────────────────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Magic byte signatures for allowed image types
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return true; // No known signature to check — allow (already MIME-validated)

  return signatures.some((sig) => {
    for (let i = 0; i < sig.length; i++) {
      if (buffer[i] !== sig[i]) return false;
    }
    return true;
  });
}

export async function POST(request: Request) {
  // Require admin authentication
  const authError = requireAdmin(request);
  if (authError) return authError;

  // Rate limit: 10 uploads per minute per IP
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 10 });
  if (limited) return limited;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `File type not allowed. Accepted types: JPEG, PNG, WebP, GIF`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (file signature) to prevent MIME spoofing
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "File content does not match declared type",
        },
        { status: 400 }
      );
    }

    const base64Data = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64Data}`;

    // Cloudinary upload (credentials from env only)
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (cloudName && uploadPreset) {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const uploadBody = new FormData();
      uploadBody.append("file", dataUri);
      uploadBody.append("upload_preset", uploadPreset);

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: uploadBody,
      });

      const data = await res.json();

      if (data.secure_url) {
        return NextResponse.json({ success: true, url: data.secure_url });
      }
    }

    // Fallback: return base64 Data URI
    return NextResponse.json({ success: true, url: dataUri });
  } catch (error) {
    return safeErrorResponse(error, "Failed to upload image");
  }
}
