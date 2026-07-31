import { NextResponse } from "next/server";
import { requireAdmin, safeErrorResponse } from "../../../../lib/apiAuth";
import { rateLimitResponse } from "../../../../lib/rateLimit";
import { secureId } from "../../../../lib/auth";

let INQUIRIES_DB = [
  {
    id: "inq-1",
    name: "Subhakanta Jena",
    companyName: "Mayfair Hotels & Resorts",
    email: "purchase@mayfairhotels.com",
    phone: "+91 94370 12345",
    city: "Bhubaneswar",
    itemTitle: "Odisha Teak Lounge Chair",
    quantity: 45,
    notes: "Requires 45 units with custom walnut stain for luxury resort patio.",
    status: "NEW",
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  // GET inquiries is restricted to admins only (H1 fix)
  const authError = requireAdmin(request);
  if (authError) return authError;

  return NextResponse.json({
    success: true,
    total: INQUIRIES_DB.length,
    inquiries: INQUIRIES_DB,
  });
}

export async function POST(request: Request) {
  // Rate limit: 3 inquiries per 5 minutes per IP
  const limited = rateLimitResponse(request, { windowMs: 5 * 60 * 1000, max: 3 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { name, companyName, email, phone, city, itemTitle, quantity, notes } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { success: false, error: "Contact name and phone/email required" },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim().slice(0, 100);
    const cleanCompany = companyName ? String(companyName).trim().slice(0, 100) : "Independent Trade Buyer";
    const cleanEmail = email ? String(email).trim().toLowerCase() : `${phone}@wholesale.in`;
    const cleanPhone = phone ? String(phone).trim() : "";
    const cleanCity = city ? String(city).trim().slice(0, 50) : "Bhubaneswar";
    const cleanTitle = itemTitle ? String(itemTitle).trim().slice(0, 150) : "Wholesale B2B Inquiry";
    const cleanNotes = notes ? String(notes).trim().slice(0, 1000) : "Submitted via Wholesale B2B Trade form.";

    const newInquiry = {
      id: secureId("inq"),
      name: cleanName,
      companyName: cleanCompany,
      email: cleanEmail,
      phone: cleanPhone,
      city: cleanCity,
      itemTitle: cleanTitle,
      quantity: Math.max(1, Number(quantity) || 10),
      notes: cleanNotes,
      status: "NEW",
      createdAt: new Date().toISOString()
    };

    INQUIRIES_DB.unshift(newInquiry);

    return NextResponse.json(
      {
        success: true,
        message: "Wholesale inquiry received successfully. Our sales team will contact you within 24 hours.",
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Failed to submit wholesale inquiry");
  }
}
