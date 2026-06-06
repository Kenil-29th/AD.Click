import fs from "fs";
import path from "path";

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

const DB_PATH = path.join(process.cwd(), "src/data/photos.json");

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
}

export function getMedia(): MediaItem[] {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function getPhotos(): MediaItem[] {
  return getMedia().filter((m) => m.type === "image");
}

export function getVideos(): MediaItem[] {
  return getMedia().filter((m) => m.type === "video");
}

export function addMedia(item: MediaItem): void {
  const media = getMedia();
  media.push(item);
  fs.writeFileSync(DB_PATH, JSON.stringify(media, null, 2));
}

export function deleteMedia(id: string): MediaItem | undefined {
  const media = getMedia();
  const item = media.find((m) => m.id === id);
  const filtered = media.filter((m) => m.id !== id);
  fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));
  return item;
}

export function updateMedia(id: string, updates: Partial<Pick<MediaItem, "title" | "category" | "ratio" | "badge" | "priority">>): void {
  const media = getMedia();
  const index = media.findIndex((m) => m.id === id);
  if (index !== -1) {
    media[index] = { ...media[index], ...updates };
    fs.writeFileSync(DB_PATH, JSON.stringify(media, null, 2));
  }
}
