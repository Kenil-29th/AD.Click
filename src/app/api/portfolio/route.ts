import { NextResponse } from "next/server";
import { getPhotos } from "@/lib/photos-db";
import { PORTFOLIO } from "@/data/site";

export const dynamic = "force-dynamic";

// Combine static portfolio with Cloudinary-uploaded photos, sorted by priority
export async function GET() {
  try {
    const adminPhotos = await getPhotos();

    // Sort admin photos by priority (highest first)
    const sorted = [...adminPhotos].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    const adminItems = sorted.map((photo, index) => ({
      id: 1000 + index,
      seed: "",
      title: photo.title,
      category: photo.category,
      ratio: photo.ratio,
      imageUrl: photo.url,
      priority: photo.priority ?? 0,
    }));

    // Static items get priority 0 (always below starred admin items)
    const staticItems = PORTFOLIO.map((item) => ({
      ...item,
      imageUrl: `https://picsum.photos/seed/${item.seed}/900/1100`,
      priority: 0,
    }));

    return NextResponse.json([...adminItems, ...staticItems]);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    const staticItems = PORTFOLIO.map((item) => ({
      ...item,
      imageUrl: `https://picsum.photos/seed/${item.seed}/900/1100`,
      priority: 0,
    }));
    return NextResponse.json(staticItems);
  }
}
