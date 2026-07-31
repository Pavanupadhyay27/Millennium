import { NextResponse } from "next/server";
import { rateLimitResponse } from "../../../../lib/rateLimit";
import { safeErrorResponse } from "../../../../lib/apiAuth";
import { secureId } from "../../../../lib/auth";

// User database mock store
let USERS_DB = [
  {
    id: "u-admin",
    name: "Admin User",
    email: "admin@millenniumfurniture.in",
    phone: "+91 674 2530190",
    role: "ADMIN",
    createdAt: new Date().toISOString()
  },
  {
    id: "u-cust",
    name: "Pawan",
    email: "Pk@gmail.com",
    phone: "+91 70081 29381",
    role: "CUSTOMER",
    createdAt: new Date().toISOString()
  }
];

export async function POST(request: Request) {
  // Rate limit: 5 requests per minute per IP
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 5 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { name, email, phone } = body;
    // SECURITY: role is NEVER accepted from the client (H4 fix)

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: "Name and Email/Phone are required" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format if provided (basic Indian phone number check)
    if (phone && !/^\+?[0-9\s\-]{7,15}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email?.toLowerCase().trim();
    const sanitizedPhone = phone?.trim();

    const existing = USERS_DB.find(
      (u) =>
        (sanitizedEmail && u.email.toLowerCase() === sanitizedEmail) ||
        (sanitizedPhone && u.phone === sanitizedPhone)
    );

    if (existing) {
      // Return minimal user info — never expose role to client on auto-login
      return NextResponse.json({
        success: true,
        message: "User signed in successfully",
        user: {
          id: existing.id,
          name: existing.name,
          email: existing.email,
        },
      });
    }

    const newUser = {
      id: secureId("u"),
      name: name.trim().slice(0, 100), // Limit name length
      email: sanitizedEmail || `${sanitizedPhone}@millenniumfurniture.in`,
      phone: sanitizedPhone || "",
      role: "CUSTOMER", // Always CUSTOMER — never accept from client
      createdAt: new Date().toISOString()
    };

    USERS_DB.push(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Registration failed");
  }
}
