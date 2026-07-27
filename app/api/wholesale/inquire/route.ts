import { NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INQUIRIES_DB.length,
    inquiries: INQUIRIES_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companyName, email, phone, city, itemTitle, quantity, notes } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { success: false, error: "Contact name and phone/email required" },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      name,
      companyName: companyName || "Independent Trade Buyer",
      email: email || `${phone}@wholesale.in`,
      phone,
      city: city || "Bhubaneswar",
      itemTitle: itemTitle || "Wholesale B2B Inquiry",
      quantity: Number(quantity) || 10,
      notes: notes || "Submitted via Wholesale B2B Trade form.",
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit wholesale inquiry" },
      { status: 500 }
    );
  }
}
