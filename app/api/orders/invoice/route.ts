import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateInvoicePDFBuffer } from "../../../../lib/pdfInvoice";
import { rateLimitResponse } from "../../../../lib/rateLimit";
import { escapeHtml, safeErrorResponse } from "../../../../lib/apiAuth";

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute per IP
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 10 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { orderId, customerName, customerEmail, customerPhone, address, city, state, postalCode, gstin, items, totalAmount, date } = body;

    const cleanEmail = customerEmail ? String(customerEmail).trim().toLowerCase() : "customer@millenniumfurniture.in";
    const cleanName = customerName ? String(customerName).trim().slice(0, 100) : "Valued Customer";
    const cleanOrderId = orderId ? String(orderId).trim() : `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Generate Binary PDF Invoice Buffer using @react-pdf/renderer
    const pdfBuffer = await generateInvoicePDFBuffer({
      orderId: cleanOrderId,
      customerName: cleanName,
      customerEmail: cleanEmail,
      customerPhone: customerPhone ? String(customerPhone).trim() : "+91 93343 09230",
      address: address ? String(address).trim() : "Main Showroom Premises",
      city: city ? String(city).trim() : "Bhubaneswar",
      state: state ? String(state).trim() : "Odisha",
      postalCode: postalCode ? String(postalCode).trim() : "751001",
      gstin: gstin ? String(gstin).trim() : "21AAAFM9283K1Z9",
      items: items || [{ name: "Solid Teak Furniture Collection", quantity: 1, price: totalAmount || 35000 }],
      totalAmount: totalAmount || 35000,
      date: date || new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    });

    // 2. Dispatch Email via Resend if API key is present
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && customerEmail) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Millennium Furniture <onboarding@resend.dev>",
          to: [cleanEmail],
          subject: `Tax Invoice PDF - Order ${escapeHtml(cleanOrderId)} | Millennium Furniture`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #1F1B16; max-width: 600px; margin: 0 auto; border: 1px solid #0D5C53; border-radius: 10px; overflow: hidden;">
              <div style="background: #0D5C53; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 22px;">MILLENNIUM FURNITURE</h1>
                <p style="margin: 4px 0 0 0; font-size: 11px;">Bhubaneswar, Odisha, India</p>
              </div>
              <div style="padding: 20px; background: #FAF7F2;">
                <h2 style="color: #0D5C53; margin-top: 0;">Official Tax Invoice Attached</h2>
                <p>Dear ${escapeHtml(cleanName)},</p>
                <p>Please find attached your official, digitally certified PDF tax invoice for order <strong>${escapeHtml(cleanOrderId)}</strong>.</p>
                <p style="font-size: 12px; color: #666;">Total Amount Paid: <strong>₹${Number(totalAmount || 0).toLocaleString("en-IN")}</strong></p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `Tax-Invoice-${cleanOrderId}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      } catch (e) {
        console.warn("Resend email dispatch warning:", e);
      }
    }

    // 3. Return Binary PDF with application/pdf Content-Type headers for browser opening
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${cleanOrderId}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to generate PDF invoice");
  }
}
