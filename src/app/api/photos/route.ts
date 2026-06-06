import { NextRequest, NextResponse } from "next/server";
import { addMedia, getMedia, deleteMedia, updateMedia } from "@/lib/photos-db";

export async function GET() {
  try {
    const media = getMedia();
    return NextResponse.json(media);
  } catch (error) {
    console.error("GET /api/photos error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uploadToCloudinary } = await import("@/lib/cloudinary");

    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const ratio = formData.get("ratio") as string;
    const mediaType = formData.get("mediaType") as "image" | "video";
    const badge = formData.get("badge") as string | null;
    const duration = formData.get("duration") as string | null;
    const priority = parseInt(formData.get("priority") as string) || 0;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, {
      folder: `adclickss/${mediaType === "video" ? "videos" : "portfolio"}`,
      resource_type: mediaType || "image",
    });

    const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // For videos, generate a thumbnail URL from Cloudinary
    const thumbnail = mediaType === "video"
      ? result.secure_url
          .replace("/video/upload/", "/video/upload/so_1,w_720,h_1280,c_fill,f_jpg/")
      : undefined;

    const item = {
      id,
      type: mediaType || "image",
      title,
      category,
      ratio: ratio || "4/5",
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail,
      duration: duration || undefined,
      badge: badge || undefined,
      priority,
      createdAt: new Date().toISOString(),
    };

    addMedia(item);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const item = deleteMedia(id);

  // Also delete from Cloudinary
  if (item) {
    try {
      const { deleteFromCloudinary } = await import("@/lib/cloudinary");
      await deleteFromCloudinary(item.publicId, item.type);
    } catch (e) {
      console.error("Cloudinary delete error:", e);
    }
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, ratio, badge, priority } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    updateMedia(id, { title, category, ratio, badge, priority });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
