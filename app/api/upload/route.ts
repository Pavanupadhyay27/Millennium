import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64Data}`;

    // Cloudinary unsigned upload endpoint preset (or unsigned demo cloud)
    // Uses standard Cloudinary upload API
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "demo";

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const body = new FormData();
    body.append("file", dataUri);
    body.append("upload_preset", uploadPreset);

    const res = await fetch(cloudinaryUrl, {
      method: "POST",
      body,
    });

    const data = await res.json();

    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url });
    }

    // Fallback if cloud name is demo/unconfigured: convert to base64 Data URI for permanent display
    return NextResponse.json({ url: dataUri });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 });
  }
}
