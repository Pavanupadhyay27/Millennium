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

    // Send 100% Free Automated WhatsApp Notification to Business (+91 94371 82931) via CallMeBot API
    const waPhone = process.env.WHATSAPP_BUSINESS_PHONE || "919437182931";
    const waApiKey = process.env.CALLMEBOT_API_KEY; // Optional free API key from CallMeBot

    if (waApiKey) {
      const itemsText = (items || [])
        .map((i: any, idx: number) => `${idx + 1}. ${i.name} (${i.color || "Natural"}) x${i.quantity} @ Rs.${i.price}`)
        .join("\n");

      const waMsg = encodeURIComponent(
        `*NEW ORDER RECEIVED - MILLENNIUM FURNITURE*\n` +
        `----------------------------------------\n` +
        `Ref: ${newOrder.orderNumber}\n` +
        `Customer: ${customerName}\n` +
        `Phone: ${customerPhone || "N/A"}\n` +
        `Address: ${address}, ${city}, ${state} - ${postalCode}\n\n` +
        `ITEMS:\n${itemsText}\n\n` +
        `Payment: Cash on Delivery (COD)\n` +
        `TOTAL: Rs.${Number(totalAmount).toLocaleString("en-IN")}`
      );

      fetch(`https://api.callmebot.com/whatsapp.php?phone=${waPhone}&text=${waMsg}&apikey=${waApiKey}`)
        .catch((err) => console.error("WhatsApp CallMeBot notification error:", err));
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
