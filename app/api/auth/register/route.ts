import { NextResponse } from "next/server";

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
  try {
    const body = await request.json();
    const { name, email, phone, password, role } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: "Name and Email/Phone are required" },
        { status: 400 }
      );
    }

    const existing = USERS_DB.find(
      (u) => (email && u.email === email) || (phone && u.phone === phone)
    );

    if (existing) {
      // Auto authenticate existing user
      return NextResponse.json({
        success: true,
        message: "User signed in successfully",
        user: existing,
      });
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email: email || `${phone}@millenniumfurniture.in`,
      phone: phone || "",
      role: role || "CUSTOMER",
      createdAt: new Date().toISOString()
    };

    USERS_DB.push(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User registered and authenticated successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
