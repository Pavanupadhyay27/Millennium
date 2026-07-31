import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const xVerify = request.headers.get("x-verify");

    const saltKey = process.env.PHONEPE_SALT_KEY || "099eb0cd-02fa-4e2d-b169-73f015e93302";
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

    if (body.response && xVerify) {
      const calculatedSha256 = crypto
        .createHash("sha256")
        .update(body.response + saltKey)
        .digest("hex");
      const expectedVerify = `${calculatedSha256}###${saltIndex}`;

      if (xVerify === expectedVerify) {
        const decodedResponse = JSON.parse(Buffer.from(body.response, "base64").toString("utf-8"));
        console.log("Verified PhonePe Callback Webhook:", decodedResponse);
        return NextResponse.json({ success: true, message: "Callback processed" });
      }
    }

    return NextResponse.json({ success: true, message: "Callback received" });
  } catch (error) {
    console.error("Error processing PhonePe callback:", error);
    return NextResponse.json({ success: false, error: "Callback error" }, { status: 400 });
  }
}
