import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// Generate a signed upload URL so the browser can upload directly to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folder } = body;

    const timestamp = Math.round(Date.now() / 1000);

    // Only include params that will be sent in the upload form
    // resource_type is NOT signed — it's part of the URL path
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder: folder || "adclickss/portfolio",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder: paramsToSign.folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
