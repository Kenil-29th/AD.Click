import { NextRequest, NextResponse } from "next/server";
import { addMedia, getMedia, deleteMedia, updateMedia } from "@/lib/photos-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const media = getMedia();
    return NextResponse.json(media);
  } catch (error) {
    console.error("GET /api/photos error:", error);
    return NextResponse.json([]);
  }
}

// Now receives metadata + Cloudinary URL (file already uploaded from browser)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, category, ratio, mediaType, badge, duration, priority, cloudinaryUrl, publicId } = body;

    if (!cloudinaryUrl || !publicId) {
      return NextResponse.json({ error: "Cloudinary URL and publicId are required" }, { status: 400 });
    }

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
    }

    const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // For videos, generate a thumbnail URL from Cloudinary
    const thumbnail = mediaType === "video"
      ? cloudinaryUrl.replace("/video/upload/", "/video/upload/so_1,w_720,h_1280,c_fill,f_jpg/")
      : undefined;

    const item = {
      id,
      type: mediaType || "image",
      title,
      category,
      ratio: ratio || "4/5",
      url: cloudinaryUrl,
      publicId,
      thumbnail,
      duration: duration || undefined,
      badge: badge || undefined,
      priority: priority || 0,
      createdAt: new Date().toISOString(),
    };

    addMedia(item);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
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
