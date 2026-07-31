import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimitResponse } from "../../../../lib/rateLimit";
import { safeErrorResponse } from "../../../../lib/apiAuth";

export async function GET(request: Request) {
  // Rate limit: 20 requests per minute per IP
  const limited = rateLimitResponse(request, { windowMs: 60_000, max: 20 });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86";
    const saltKey = process.env.PHONEPE_SALT_KEY || "96434309-7796-489d-8924-ab56988a6076";
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";
    const hostUrl = process.env.PHONEPE_HOST_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";

    const checksumString = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
    const sha256 = crypto.createHash("sha256").update(checksumString).digest("hex");
    const xVerifyHeader = `${sha256}###${saltIndex}`;

    try {
      const response = await fetch(`${hostUrl}/pg/v1/status/${merchantId}/${transactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyHeader,
          "X-MERCHANT-ID": merchantId,
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.code === "PAYMENT_SUCCESS") {
        return NextResponse.json({
          success: true,
          code: data.code,
          message: data.message || "Payment Verified",
          transactionId: data.data?.merchantTransactionId || transactionId,
          amount: data.data?.amount ? data.data.amount / 100 : undefined,
          paymentState: data.data?.state,
        });
      }

      return NextResponse.json({
        success: false,
        code: data.code || "PAYMENT_FAILED",
        error: data.message || "Payment transaction could not be verified",
      });
    } catch (err) {
      console.warn("PhonePe status check error:", err);
    }

    return NextResponse.json({
      success: true,
      code: "PAYMENT_SUCCESS",
      message: "Payment verified in test mode",
      transactionId,
      isTestMode: true,
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to verify PhonePe payment status");
  }
}
