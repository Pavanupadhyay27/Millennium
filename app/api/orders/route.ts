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

    // Send Free Automated Instant Order Push to Telegram Bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "8984065109:AAGkQ__Pl3zoH1-47BrRUhiaiXjF_3RA5GE";
    const chatId = process.env.TELEGRAM_CHAT_ID; // Auto-sent if CHAT_ID configured

    if (botToken && chatId) {
      const itemsList = (items || [])
        .map((i: any, idx: number) => `${idx + 1}. *${i.name}* (${i.color || "Natural"}) x${i.quantity} @ ₹${i.price}`)
        .join("\n");

      const telegramMsg =
        `🚨 *NEW ORDER RECEIVED - MILLENNIUM FURNITURE*\n` +
        `----------------------------------------\n` +
        `🆔 *Order Reference:* \`${newOrder.orderNumber}\`\n` +
        `👤 *Customer:* ${customerName}\n` +
        `📞 *Phone:* ${customerPhone || "N/A"}\n` +
        `✉️ *Email:* ${customerEmail || "N/A"}\n` +
        `📍 *Address:* ${address}, ${city}, ${state} - ${postalCode}\n\n` +
        `🛍️ *ITEMS ORDERED:*\n${itemsList}\n\n` +
        `----------------------------------------\n` +
        `💵 *Payment Method:* Cash on Delivery (COD)\n` +
        `💰 *TOTAL AMOUNT:* ₹${Number(totalAmount).toLocaleString("en-IN")}`;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMsg,
          parse_mode: "Markdown",
        }),
      }).catch((err) => console.error("Telegram notification error:", err));
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
