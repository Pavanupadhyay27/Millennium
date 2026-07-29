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

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TJQxxOQXnCKeTx";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "XpHQVNa35xkQ620Out9A402t";

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials not configured in server environment" },
        { status: 401 }
      );
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const orderOptions = {
      amount: amountInPaise,
      currency: currency || "INR",
      receipt: receipt || `rec_${Date.now()}`,
      notes: notes || {
        store: "Millennium Furniture Bhubaneswar",
      },
    };

    const razorpayOrder = await instance.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: key_id,
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Razorpay API error while creating order" },
      { status: 500 }
    );
  }
}
