import { NextResponse } from "next/server";
import { getVideos } from "@/lib/photos-db";
import { VIDEOS } from "@/data/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const adminVideos = getVideos();

  // Sort admin videos by priority (highest first)
  const sorted = [...adminVideos].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  // Convert admin videos to the same shape as static videos
  const adminItems = sorted.map((video) => ({
    id: video.id,
    title: video.title,
    badge: video.badge || "VIDEO",
    duration: video.duration || "",
    thumb: video.thumbnail || video.url.replace(/\.[^.]+$/, ".jpg"),
    videoUrl: video.url,
    source: "cloudinary" as const,
    priority: video.priority ?? 0,
  }));

  // Static videos (YouTube-based) get priority 0
  const staticItems = VIDEOS.map((v) => ({
    id: v.id,
    title: v.title,
    badge: v.badge,
    duration: v.duration,
    thumb: `https://picsum.photos/seed/${v.thumb}/720/1280`,
    youtubeId: v.youtubeId,
    source: "youtube" as const,
    priority: 0,
  }));

  return NextResponse.json([...adminItems, ...staticItems]);
}
