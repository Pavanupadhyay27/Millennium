import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Initialize Razorpay SDK using keys from environment variables
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_millennium_demo";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_for_demo";

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    // Create Razorpay Order (amount in paise, e.g. Rs. 24500 => 2450000 paise)
    const orderOptions = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: receipt || `rec_${Date.now()}`,
      notes: notes || {
        store: "Millennium Furniture Bhubaneswar",
      },
    };

    const razorpayOrder = await instance.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: key_id,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
