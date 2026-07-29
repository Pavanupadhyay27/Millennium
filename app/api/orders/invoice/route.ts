import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateInvoicePDFBuffer } from "../../../../lib/pdfInvoice";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, customerName, customerEmail, customerPhone, address, city, state, postalCode, gstin, items, totalAmount, date } = body;

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: "Customer email is required to send invoice" },
        { status: 400 }
      );
    }

    // 1. Generate PDF Invoice Buffer
    const pdfBuffer = await generateInvoicePDFBuffer({
      orderId: orderId || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || "Valued Customer",
      customerEmail,
      customerPhone: customerPhone || "+91 93343 09230",
      address: address || "Janpath Road",
      city: city || "Bhubaneswar",
      state: state || "Odisha",
      postalCode: postalCode || "751001",
      gstin: gstin || "21AAAFM9283K1Z9",
      items: items || [{ name: "Handcrafted Teak Furniture Package", quantity: 1, price: totalAmount || 25000 }],
      totalAmount: totalAmount || 25000,
      date: date || new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    });

    // 2. Dispatch Email via Resend if API key is provided
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailDispatched = false;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: "Millennium Furniture <onboarding@resend.dev>",
        to: [customerEmail],
        subject: `Tax Invoice PDF - Order ${orderId || 'Confirmation'} | Millennium Furniture`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1F1B16; max-width: 600px; margin: 0 auto; border: 1px solid #0D5C53; border-radius: 10px; overflow: hidden;">
            <div style="background: #0D5C53; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">MILLENNIUM FURNITURE</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px;">Bhubaneswar, Odisha, India</p>
            </div>
            <div style="padding: 20px; background: #FAF7F2;">
              <h2 style="color: #0D5C53; margin-top: 0;">Official Tax Invoice Attached</h2>
              <p>Dear ${customerName},</p>
              <p>Please find attached your official, digitally certified PDF tax invoice for order <strong>${orderId}</strong>.</p>
              <p style="font-size: 12px; color: #666;">Total Amount Paid: <strong>₹${Number(totalAmount).toLocaleString("en-IN")}</strong></p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Tax-Invoice-${orderId || 'Millennium'}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
      emailDispatched = true;
    }

    // Convert Buffer to base64 for preview / download option on front-end
    const base64Pdf = pdfBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      message: emailDispatched ? "Email sent with PDF invoice attached" : "PDF invoice created successfully",
      emailDispatched,
      pdfBase64: base64Pdf,
    });
  } catch (error: any) {
    console.error("Manual Email/PDF API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate or send PDF invoice" },
      { status: 500 }
    );
  }
}
