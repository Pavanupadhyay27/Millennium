import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimitResponse } from "../../../../lib/rateLimit";
import { safeErrorResponse } from "../../../../lib/apiAuth";

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute per IP
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 10 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { amount, customerPhone, customerName, customerEmail, orderId } = body;

    // Minimum amount validation: 100 paise (₹1)
    const amountInPaise = Math.round(Number(amount) * 100);
    if (!amountInPaise || amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Minimum order amount must be at least ₹1" },
        { status: 400 }
      );
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86";
    const saltKey = process.env.PHONEPE_SALT_KEY || "96434309-7796-489d-8924-ab56988a6076";
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";
    const hostUrl = process.env.PHONEPE_HOST_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    const merchantTransactionId = `MT_${orderId || Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const merchantUserId = `MUID_${customerPhone ? customerPhone.replace(/\D/g, "").slice(-10) : Date.now()}`;

    const redirectUrl = `${appUrl}/checkout/phonepe-status?transactionId=${merchantTransactionId}&orderId=${orderId || ""}`;
    const callbackUrl = `${appUrl}/api/phonepe/callback`;

    const payPayload = {
      merchantId,
      merchantTransactionId,
      merchantUserId,
      amount: amountInPaise,
      redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl,
      mobileNumber: customerPhone ? customerPhone.replace(/\D/g, "").slice(-10) : "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payPayload)).toString("base64");
    const checksumString = `${base64Payload}/pg/v1/pay${saltKey}`;
    const sha256 = crypto.createHash("sha256").update(checksumString).digest("hex");
    const xVerifyHeader = `${sha256}###${saltIndex}`;

    const response = await fetch(`${hostUrl}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyHeader,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const responseData = await response.json();
    console.log("PhonePe Real PG Response:", JSON.stringify(responseData));

    if (
      response.ok &&
      responseData.success &&
      responseData.data?.instrumentResponse?.redirectInfo?.url
    ) {
      return NextResponse.json({
        success: true,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: responseData.message || "Failed to initialize PhonePe payment gateway",
        code: responseData.code,
      },
      { status: 400 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Failed to initiate PhonePe payment");
  }
}
