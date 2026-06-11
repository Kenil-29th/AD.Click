import { Redis } from "@upstash/redis";

export type MediaItem = {
  id: string;
  type: "image" | "video";
  title: string;
  category: string;
  ratio: string;
  url: string;
  publicId: string;
  thumbnail?: string;
  duration?: string;
  badge?: string;
  priority: number;
  createdAt: string;
};

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const MEDIA_KEY = "adclickss:media";

export async function getMedia(): Promise<MediaItem[]> {
  const data = await redis.get<MediaItem[]>(MEDIA_KEY);
  return data || [];
}

export async function getPhotos(): Promise<MediaItem[]> {
  const media = await getMedia();
  return media.filter((m) => m.type === "image");
}

export async function getVideos(): Promise<MediaItem[]> {
  const media = await getMedia();
  return media.filter((m) => m.type === "video");
}

export async function addMedia(item: MediaItem): Promise<void> {
  const media = await getMedia();
  media.push(item);
  await redis.set(MEDIA_KEY, media);
}

export async function deleteMedia(id: string): Promise<MediaItem | undefined> {
  const media = await getMedia();
  const item = media.find((m) => m.id === id);
  const filtered = media.filter((m) => m.id !== id);
  await redis.set(MEDIA_KEY, filtered);
  return item;
}

export async function updateMedia(id: string, updates: Partial<Pick<MediaItem, "title" | "category" | "ratio" | "badge" | "priority">>): Promise<void> {
  const media = await getMedia();
  const index = media.findIndex((m) => m.id === id);
  if (index !== -1) {
    media[index] = { ...media[index], ...updates };
    await redis.set(MEDIA_KEY, media);
  }
}
