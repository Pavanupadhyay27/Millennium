import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt, notes } = body;

    // Minimum amount validation: 100 paise (Rs. 1)
    const amountInPaise = Math.round(Number(amount) * 100);
    if (!amountInPaise || amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Minimum order amount must be at least 100 paise (Rs. 1)" },
        { status: 400 }
      );
    }

    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TJRLmrLh2IFoPD";
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "CE3e1InOR0tJJPkzo0JbVq7R";

    const key_id = rawKeyId.replace(/^["']|["']$/g, "").trim();
    const key_secret = rawKeySecret.replace(/^["']|["']$/g, "").trim();

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials not configured in server environment" },
        { status: 401 }
      );
    }

    // Direct HTTP call to Razorpay Order API using Basic Auth
    const authHeader = `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString("base64")}`;

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: currency || "INR",
        receipt: receipt || `rec_${Date.now()}`,
        notes: notes || {
          store: "Millennium Furniture Bhubaneswar",
        },
      }),
    });

    const rzpData = await rzpResponse.json();

    if (!rzpResponse.ok) {
      console.error("Razorpay API Error Response:", rzpData);
      return NextResponse.json(
        {
          success: false,
          error: rzpData.error?.description || rzpData.error?.reason || "Razorpay API error while creating order",
          details: rzpData,
        },
        { status: rzpResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: rzpData.id,
      orderId: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
      keyId: key_id,
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Exception:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server exception while creating Razorpay order" },
      { status: 500 }
    );
  }
}
