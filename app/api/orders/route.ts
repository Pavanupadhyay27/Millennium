import { NextResponse } from "next/server";

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
    const { customerName, customerEmail, customerPhone, address, city, state, postalCode, items, totalAmount } = body;

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name and cart items are required" },
        { status: 400 }
      );
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
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

    // 1. Send via Twilio WhatsApp API if configured
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
      `Phone: ${customerPhone || "N/A"}\n` +
      `Address: ${address}, ${city}, ${state} - ${postalCode}\n\n` +
      `ITEMS:\n${itemsFormatted}\n\n` +
      `Payment: Cash on Delivery (COD)\n` +
      `TOTAL: Rs.${Number(totalAmount).toLocaleString("en-IN")}`;

    if (twilioSid && twilioToken) {
      fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
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
      }).catch((err) => console.error("Twilio WhatsApp error:", err));
    } else {
      // 2. Fallback: CallMeBot Free WhatsApp API
      const waPhone = process.env.WHATSAPP_BUSINESS_PHONE || "919334309230";
      const waApiKey = process.env.CALLMEBOT_API_KEY;
      if (waApiKey) {
        fetch(`https://api.callmebot.com/whatsapp.php?phone=${waPhone}&text=${encodeURIComponent(orderSummaryText)}&apikey=${waApiKey}`)
          .catch((err) => console.error("WhatsApp CallMeBot notification error:", err));
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: newOrder,
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
