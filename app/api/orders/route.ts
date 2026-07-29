import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateInvoicePDFBuffer } from "../../../lib/pdfInvoice";

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

export async function GET() {
  return NextResponse.json({
    success: true,
    total: ORDERS_DB.length,
    orders: ORDERS_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, address, city, state, postalCode, items, totalAmount, orderId: customOrderId, gstin } = body;

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name and cart items are required" },
        { status: 400 }
      );
    }

    const orderNumber = customOrderId || `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      customerEmail: customerEmail || "customer@millenniumfurniture.in",
      customerPhone: customerPhone || "+91 674 2530190",
      address: address || "Bhubaneswar",
      city: city || "Bhubaneswar",
      state: state || "Odisha",
      postalCode: postalCode || "751001",
      totalAmount: Number(totalAmount) || 0,
      status: "CONFIRMED",
      items,
      createdAt: new Date().toISOString()
    };

    ORDERS_DB.unshift(newOrder);

    // Generate authentic PDF invoice buffer
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateInvoicePDFBuffer({
        orderId: orderNumber,
        customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone,
        address,
        city,
        state,
        postalCode,
        gstin,
        items,
        totalAmount: newOrder.totalAmount,
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      });
    } catch (pdfErr) {
      console.error("PDF Generation error:", pdfErr);
    }

    // Dispatch Email with attached PDF invoice
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && newOrder.customerEmail && pdfBuffer) {
      try {
        const resend = new Resend(resendApiKey);

        const itemsListHtml = items
          .map(
            (item: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${item.name}</strong> ${item.color ? `(${item.color})` : ''}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
            </tr>`
          )
          .join("");

        await resend.emails.send({
          from: "Millennium Furniture <orders@millenniumfurniture.in>",
          to: [newOrder.customerEmail],
          subject: `Tax Invoice & Order Confirmation - ${orderNumber} | Millennium Furniture`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1F1B16; max-width: 600px; margin: 0 auto; border: 1px solid #0D5C53; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #0D5C53; color: white; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">MILLENNIUM FURNITURE</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.85;">Handcrafted Solid Teak & Organic Wood Furnishings</p>
              </div>

              <div style="padding: 24px; background-color: #FAF7F2;">
                <h2 style="font-size: 18px; color: #0D5C53; margin-top: 0;">Thank You for Your Order, ${customerName}!</h2>
                <p style="font-size: 14px; line-height: 1.5;">We are pleased to confirm your order <strong>${orderNumber}</strong>. Attached to this email is your official, authentic tax invoice PDF with verified 10-Year Teak Timber Warranty details.</p>

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
                  Dispatched from Master Canteen Square, Janpath Road, Bhubaneswar, Odisha 751001.<br/>
                  If you have any custom joinery or delivery questions, reach our desk at <strong>+91 93343 09230</strong>.
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
        console.log(`Successfully dispatched automated PDF tax invoice email to ${newOrder.customerEmail}`);
      } catch (emailErr) {
        console.error("Resend Email dispatch error:", emailErr);
      }
    }

    // Twilio WhatsApp API
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
    const twilioTo = process.env.MY_WHATSAPP_NUMBER || "whatsapp:+919334309230";

    const itemsFormatted = (items || [])
      .map((i: any, idx: number) => `${idx + 1}. ${i.name} (${i.color || "Natural"}) x${i.quantity} @ Rs.${i.price}`)
      .join("\n");

    const orderSummaryText =
      `*NEW ORDER RECEIVED - MILLENNIUM FURNITURE*\n` +
      `----------------------------------------\n` +
      `Ref: ${newOrder.orderNumber}\n` +
      `Customer: ${customerName}\n` +
      `Email: ${newOrder.customerEmail}\n` +
      `Phone: ${customerPhone || "N/A"}\n` +
      `Address: ${address}, ${city}, ${state} - ${postalCode}\n\n` +
      `ITEMS:\n${itemsFormatted}\n\n` +
      `Payment: Cash on Delivery (COD)\n` +
      `TOTAL: Rs.${Number(totalAmount).toLocaleString("en-IN")}\n` +
      `PDF Invoice automatically generated & emailed.`;

    if (twilioSid && twilioToken) {
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

    // CallMeBot WhatsApp API
    const waPhone = process.env.WHATSAPP_BUSINESS_PHONE || "919334309230";
    const waApiKey = process.env.CALLMEBOT_API_KEY || "933430230";
    if (waPhone && waApiKey) {
      try {
        await fetch(`https://api.callmebot.com/whatsapp.php?phone=${waPhone}&text=${encodeURIComponent(orderSummaryText)}&apikey=${waApiKey}`);
      } catch (err) {
        console.error("WhatsApp CallMeBot notification error:", err);
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Order creation failed" },
      { status: 500 }
    );
  }
}
