import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateInvoicePDFBuffer } from "../../../lib/pdfInvoice";
import { rateLimitResponse } from "../../../lib/rateLimit";
import { requireAdmin, escapeHtml, safeErrorResponse } from "../../../lib/apiAuth";
import { secureId, secureOrderNumber } from "../../../lib/auth";

let ORDERS_DB = [
  {
    id: "ord-1",
    orderNumber: "RET-2026-3021",
    customerName: "Pawan",
    customerEmail: "Pk@gmail.com",
    customerPhone: "+91 70081 29381",
    address: "Plot 412, Kharvel Nagar",
    city: "Bhubaneswar",
    state: "Odisha",
    postalCode: "751001",
    totalAmount: 24500,
    status: "DELIVERED",
    items: [
      { name: "Odisha Teak Lounge Chair", price: 24500, quantity: 1, color: "Natural Wood" }
    ],
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  // Protect GET orders route for admins only
  const authError = requireAdmin(request);
  if (authError) return authError;

  return NextResponse.json({
    success: true,
    total: ORDERS_DB.length,
    orders: ORDERS_DB,
  });
}

export async function POST(request: Request) {
  // Rate limit: 5 requests per minute per IP for order placement
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 5 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, address, city, state, postalCode, items, totalAmount, orderId: customOrderId, gstin } = body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name and cart items are required" },
        { status: 400 }
      );
    }

    // Sanitize user inputs for safe processing
    const cleanCustomerName = String(customerName).trim().slice(0, 100);
    const cleanCustomerEmail = customerEmail ? String(customerEmail).trim().toLowerCase() : "customer@millenniumfurniture.in";
    const cleanCustomerPhone = customerPhone ? String(customerPhone).trim() : "+91 674 2530190";
    const cleanAddress = address ? String(address).trim() : "Bhubaneswar";
    const cleanCity = city ? String(city).trim() : "Bhubaneswar";
    const cleanState = state ? String(state).trim() : "Odisha";
    const cleanPostalCode = postalCode ? String(postalCode).trim() : "751001";
    const cleanGstin = gstin ? String(gstin).trim() : "";

    const orderNumber = customOrderId ? String(customOrderId).trim() : secureOrderNumber();

    const sanitizedItems = items.map((item: any) => ({
      name: String(item.name || "Item").slice(0, 150),
      color: item.color ? String(item.color).slice(0, 50) : undefined,
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Math.max(0, Number(item.price) || 0)
    }));

    const newOrder = {
      id: secureId("ord"),
      orderNumber,
      customerName: cleanCustomerName,
      customerEmail: cleanCustomerEmail,
      customerPhone: cleanCustomerPhone,
      address: cleanAddress,
      city: cleanCity,
      state: cleanState,
      postalCode: cleanPostalCode,
      totalAmount: Number(totalAmount) || 0,
      status: "CONFIRMED",
      items: sanitizedItems,
      createdAt: new Date().toISOString()
    };

    ORDERS_DB.unshift(newOrder);

    // Generate authentic PDF invoice buffer
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateInvoicePDFBuffer({
        orderId: orderNumber,
        customerName: cleanCustomerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: cleanCustomerPhone,
        address: cleanAddress,
        city: cleanCity,
        state: cleanState,
        postalCode: cleanPostalCode,
        gstin: cleanGstin,
        items: sanitizedItems,
        totalAmount: newOrder.totalAmount,
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      });
    } catch (pdfErr) {
      console.error("PDF Generation error:", pdfErr);
    }

    // Dispatch Email with attached PDF invoice via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && newOrder.customerEmail && pdfBuffer) {
      try {
        const resend = new Resend(resendApiKey);

        // Escape all HTML values to prevent XSS in email clients (H2 fix)
        const itemsListHtml = sanitizedItems
          .map(
            (item: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${escapeHtml(item.name)}</strong> ${item.color ? `(${escapeHtml(item.color)})` : ''}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
            </tr>`
          )
          .join("");

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Millennium Furniture <onboarding@resend.dev>",
          to: [newOrder.customerEmail],
          subject: `Tax Invoice & Order Confirmation - ${escapeHtml(orderNumber)} | Millennium Furniture`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1F1B16; max-width: 600px; margin: 0 auto; border: 1px solid #0D5C53; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #0D5C53; color: white; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">MILLENNIUM FURNITURE</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.85;">Handcrafted Solid Teak & Organic Wood Furnishings</p>
              </div>

              <div style="padding: 24px; background-color: #FAF7F2;">
                <h2 style="font-size: 18px; color: #0D5C53; margin-top: 0;">Thank You for Your Order, ${escapeHtml(cleanCustomerName)}!</h2>
                <p style="font-size: 14px; line-height: 1.5;">We are pleased to confirm your order <strong>${escapeHtml(orderNumber)}</strong>. Attached is your official tax invoice PDF with verified 10-Year Teak Timber Warranty details.</p>

                <div style="background: white; border: 1px solid #E5DEC9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #0D5C53;">Order Summary</h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                      <tr style="background: #F4FAF9; text-align: left;">
                        <th style="padding: 8px;">Item</th>
                        <th style="padding: 8px; text-align: center;">Qty</th>
                        <th style="padding: 8px; text-align: right;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsListHtml}
                    </tbody>
                  </table>

                  <div style="margin-top: 16px; border-top: 2px solid #0D5C53; padding-top: 12px; text-align: right;">
                    <span style="font-size: 16px; font-weight: bold; color: #0D5C53;">Grand Total: ₹${Number(newOrder.totalAmount).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                  Dispatched from Studio: F, 2G/49, 15, Indradhanu Market, IRC Village, Complex, Bhubaneswar, Odisha 751015.<br/>
                  Questions? Call us at <strong>+91 93343 09230</strong>.
                </p>
              </div>

              <div style="background: #1F1B16; color: #FAF7F2; padding: 12px; text-align: center; font-size: 11px;">
                © 2026 Millennium Furniture Ltd. All rights reserved.
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `Invoice-${orderNumber}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      } catch (emailErr) {
        console.error("Resend Email dispatch error:", emailErr);
      }
    }

    // Twilio WhatsApp API
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER;
    const twilioTo = process.env.MY_WHATSAPP_NUMBER;

    if (twilioSid && twilioToken && twilioFrom && twilioTo) {
      const itemsFormatted = sanitizedItems
        .map((i: any, idx: number) => `${idx + 1}. ${i.name} (${i.color || "Natural"}) x${i.quantity} @ Rs.${i.price}`)
        .join("\n");

      const orderSummaryText =
        `*NEW ORDER RECEIVED - MILLENNIUM FURNITURE*\n` +
        `----------------------------------------\n` +
        `Ref: ${newOrder.orderNumber}\n` +
        `Customer: ${cleanCustomerName}\n` +
        `Email: ${newOrder.customerEmail}\n` +
        `Phone: ${cleanCustomerPhone}\n` +
        `Address: ${cleanAddress}, ${cleanCity}, ${cleanState} - ${cleanPostalCode}\n\n` +
        `ITEMS:\n${itemsFormatted}\n\n` +
        `TOTAL: Rs.${Number(totalAmount).toLocaleString("en-IN")}\n` +
        `PDF Invoice automatically generated & emailed.`;

      try {
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64"),
          },
          body: new URLSearchParams({
            From: twilioFrom,
            To: twilioTo,
            Body: orderSummaryText,
          }),
        });
      } catch (err) {
        console.error("Twilio WhatsApp dispatch error:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully and PDF invoice generated",
        order: newOrder,
        hasPdfInvoice: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Order creation failed");
  }
}
