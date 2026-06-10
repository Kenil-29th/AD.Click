"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import {
  ImagePlus,
  Trash2,
  X,
  Upload,
  Loader2,
  ArrowLeft,
  Video,
  Image as ImageIcon,
  Play,
  Star,
} from "lucide-react";
import Link from "next/link";

type MediaItem = {
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

const PHOTO_CATEGORIES = ["Portrait", "Pre-Wedding", "Car", "Birthday", "Fashion", "Events", "Editorial"];
const VIDEO_BADGES = ["SHORT FILM", "BTS", "REEL", "EVENT COVERAGE", "HIGHLIGHT", "CINEMATIC"];
const RATIOS = ["4/5", "1/1", "16/9", "3/4", "9/16"];

export function AdminPanel() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(PHOTO_CATEGORIES[0]);
  const [ratio, setRatio] = useState(RATIOS[0]);
  const [badge, setBadge] = useState(VIDEO_BADGES[0]);
  const [duration, setDuration] = useState("");
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [priority, setPriority] = useState(0);
  const [filterCategory, setFilterCategory] = useState("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    const res = await fetch("/api/photos");
    const data = await res.json();
    setMedia(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFile = (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return;

    setSelectedFile(file);
    setUploadType(isVideo ? "video" : "image");

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      // For video, create a thumbnail from the video
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        setPreview(canvas.toDataURL("image/jpeg"));
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    setUploading(true);

    try {
      // Step 1: Get signed upload params from our API
      const folder = `adclickss/${uploadType === "video" ? "videos" : "portfolio"}`;
      const sigRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });

      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, cloudName, apiKey, folder: signedFolder } = await sigRes.json();

      // Step 2: Upload directly to Cloudinary from browser
      // Only include params that were signed: folder + timestamp
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", selectedFile);
      cloudinaryForm.append("folder", signedFolder);
      cloudinaryForm.append("timestamp", String(timestamp));
      cloudinaryForm.append("signature", signature);
      cloudinaryForm.append("api_key", apiKey);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${uploadType}/upload`;
      const cloudRes = await fetch(uploadUrl, { method: "POST", body: cloudinaryForm });

      if (!cloudRes.ok) {
        const errText = await cloudRes.text();
        throw new Error(`Cloudinary upload failed: ${errText}`);
      }

      const cloudData = await cloudRes.json();

      // Step 3: Save metadata to our API
      const saveRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          ratio,
          mediaType: uploadType,
          priority,
          badge: uploadType === "video" ? badge : undefined,
          duration: uploadType === "video" ? duration : undefined,
          cloudinaryUrl: cloudData.secure_url,
          publicId: cloudData.public_id,
        }),
      });

      if (saveRes.ok) {
        resetForm();
        setShowUpload(false);
        fetchMedia();
      } else {
        const err = await saveRes.json();
        alert(err.error || "Failed to save metadata");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This will also remove it from Cloudinary.")) return;
    await fetch(`/api/photos?id=${id}`, { method: "DELETE" });
    fetchMedia();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitle("");
    setCategory(PHOTO_CATEGORIES[0]);
    setRatio(RATIOS[0]);
    setBadge(VIDEO_BADGES[0]);
    setDuration("");
    setUploadType("image");
    setPriority(0);
  };

  const photos = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");
  const currentItems = activeTab === "photos" ? photos : videos;
  const filteredUnsorted = filterCategory === "All" ? currentItems : currentItems.filter((m) => m.category === filterCategory);
  const filtered = [...filteredUnsorted].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const handleTogglePriority = async (item: MediaItem) => {
    const newPriority = item.priority > 0 ? 0 : 1;
    await fetch("/api/photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, priority: newPriority }),
    });
    fetchMedia();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm">Back to site</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="font-display text-xl md:text-2xl">
              AD.<span className="text-gold">CLICKSS</span>
              <span className="ml-3 text-sm font-sans text-muted-foreground">Admin</span>
            </h1>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-gold-foreground transition hover:bg-gold/90 active:scale-[0.97]"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div className="border border-white/10 bg-surface p-4">
            <p className="text-2xl font-display text-gold">{photos.length}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">Photos</p>
          </div>
          <div className="border border-white/10 bg-surface p-4">
            <p className="text-2xl font-display text-gold">{videos.length}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">Videos</p>
          </div>
          <div className="border border-white/10 bg-surface p-4">
            <p className="text-2xl font-display text-foreground">{media.length}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">Total</p>
          </div>
          <div className="border border-white/10 bg-surface p-4">
            <p className="text-2xl font-display text-foreground">
              {new Set(media.map((m) => m.category)).size}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">Categories</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-white/10">
          <button
            onClick={() => { setActiveTab("photos"); setFilterCategory("All"); }}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.22em] transition border-b-2 ${
              activeTab === "photos"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon size={16} />
            Photos ({photos.length})
          </button>
          <button
            onClick={() => { setActiveTab("videos"); setFilterCategory("All"); }}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.22em] transition border-b-2 ${
              activeTab === "videos"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video size={16} />
            Videos ({videos.length})
          </button>
        </div>

        {/* Filter */}
        <div className="-mx-4 mt-6 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex min-w-max gap-2">
            {["All", ...PHOTO_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`h-9 rounded-full border px-4 text-xs uppercase tracking-[0.22em] transition ${
                  filterCategory === c
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-white/15 text-foreground/70 hover:border-gold/60 hover:text-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {activeTab === "photos" ? (
              <ImageIcon size={48} className="text-muted-foreground/40" />
            ) : (
              <Video size={48} className="text-muted-foreground/40" />
            )}
            <p className="mt-4 text-lg text-muted-foreground">
              No {activeTab} yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Click &quot;Upload&quot; to add your first {activeTab === "photos" ? "photo" : "video"}
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-6 border border-gold/70 px-6 py-3 text-xs uppercase tracking-[0.28em] text-gold transition hover:bg-gold/10"
            >
              Upload {activeTab === "photos" ? "Photo" : "Video"}
            </button>
          </div>
        ) : (
          <Masonry
            breakpointCols={activeTab === "photos" ? { default: 4, 1024: 3, 768: 2, 480: 1 } : { default: 3, 1024: 2, 768: 1 }}
            className="admin-masonry-grid mt-6"
            columnClassName="admin-masonry-grid-column"
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative mb-3 overflow-hidden border border-white/10 bg-surface md:mb-4"
              >
                {/* Priority star badge */}
                {item.priority > 0 && (
                  <div className="absolute left-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-gold text-gold-foreground shadow-md">
                    <Star size={12} className="fill-current" />
                  </div>
                )}
                <div>
                  {item.type === "video" ? (
                    <div className="relative" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={item.thumbnail || item.url.replace(/\.[^.]+$/, ".jpg")}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/90 text-gold-foreground">
                          <Play size={18} className="ml-0.5 fill-current" />
                        </span>
                      </div>
                      {item.badge && (
                        <span className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-gold">
                          {item.badge}
                        </span>
                      )}
                      {item.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-[10px] tracking-widest text-foreground">
                          {item.duration}
                        </span>
                      )}
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      style={{ aspectRatio: item.ratio }}
                      className="w-full object-cover"
                    />
                  )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-between bg-black/75 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleTogglePriority(item)}
                      className={`grid h-8 w-8 place-items-center rounded-full transition ${
                        item.priority > 0
                          ? "bg-gold text-gold-foreground"
                          : "bg-white/20 text-white hover:bg-gold/60"
                      }`}
                      title={item.priority > 0 ? "Remove priority" : "Set as priority"}
                    >
                      <Star size={14} className={item.priority > 0 ? "fill-current" : ""} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-red-600/80 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <span className="inline-block bg-gold/90 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-gold-foreground">
                      {item.category}
                    </span>
                    <p className="mt-1 font-display text-lg text-foreground">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        )}
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg border border-white/10 bg-surface p-6 md:p-8 my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">Upload Media</h2>
              <button
                onClick={() => { setShowUpload(false); resetForm(); }}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Type selector */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => { setUploadType("image"); setSelectedFile(null); setPreview(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.22em] border transition ${
                  uploadType === "image"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/15 text-muted-foreground hover:border-gold/50"
                }`}
              >
                <ImageIcon size={14} /> Photo
              </button>
              <button
                type="button"
                onClick={() => { setUploadType("video"); setSelectedFile(null); setPreview(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.22em] border transition ${
                  uploadType === "video"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/15 text-muted-foreground hover:border-gold/50"
                }`}
              >
                <Video size={14} /> Video
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-5 space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 transition ${
                  dragOver ? "border-gold bg-gold/5" : "border-white/20 hover:border-gold/50"
                } ${preview ? "py-4" : "py-10"}`}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-40 object-contain" />
                    {uploadType === "video" && (
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/80 text-gold-foreground">
                          <Play size={14} className="ml-0.5 fill-current" />
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Drag & drop or <span className="text-gold">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      {uploadType === "image"
                        ? "JPG, PNG, WEBP up to 10MB"
                        : "MP4, MOV, WEBM up to 100MB"}
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={uploadType === "image" ? "image/*" : "video/*"}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />

              {/* Title */}
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={uploadType === "image" ? "Photo title" : "Video title"}
                  required
                  className="w-full border border-white/10 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none transition"
                />
              </div>

              {/* Category & Ratio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-white/10 bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition"
                  >
                    {PHOTO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Aspect Ratio
                  </label>
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    className="w-full border border-white/10 bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition"
                  >
                    {RATIOS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video-specific fields */}
              {uploadType === "video" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Badge / Type
                    </label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full border border-white/10 bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition"
                    >
                      {VIDEO_BADGES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Duration
                    </label>
                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 2:14"
                      className="w-full border border-white/10 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Priority (Star)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPriority(priority === star ? 0 : star)}
                      className="p-1 transition hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={`transition ${
                          star <= priority
                            ? "fill-gold text-gold"
                            : "text-white/20 hover:text-gold/50"
                        }`}
                      />
                    </button>
                  ))}
                  {priority > 0 && (
                    <span className="ml-2 text-xs text-gold">{priority} star{priority > 1 ? "s" : ""}</span>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  Higher priority items appear first on the site
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!selectedFile || !title || uploading}
                className="flex h-14 w-full items-center justify-center bg-gold text-sm uppercase tracking-[0.28em] text-gold-foreground transition hover:bg-gold/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Uploading to Cloudinary...
                  </span>
                ) : (
                  `Upload ${uploadType === "image" ? "Photo" : "Video"}`
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
