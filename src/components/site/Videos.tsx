"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { VIDEOS } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

type VideoItem = {
  id: string;
  title: string;
  badge: string;
  duration: string;
  thumb: string;
  youtubeId?: string;
  videoUrl?: string;
  source: "youtube" | "cloudinary";
};

export function Videos() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [allVideos, setAllVideos] = useState<VideoItem[]>(
    VIDEOS.map((v) => ({
      id: v.id,
      title: v.title,
      badge: v.badge,
      duration: v.duration,
      thumb: `https://picsum.photos/seed/${v.thumb}/720/1280`,
      youtubeId: v.youtubeId,
      source: "youtube" as const,
    }))
  );

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAllVideos(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!openId) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const open = allVideos.find((v) => v.id === openId);
  const featured = allVideos[0];

  if (!featured) return null;

  return (
    <section id="videos" className="bg-surface px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <GoldEyebrow>In Motion</GoldEyebrow>
        <h2 className="font-display mt-3 text-4xl md:text-6xl">Behind the lens.</h2>

        {/* Hero reel */}
        <button
          onClick={() => setOpenId(featured.id)}
          className="group relative mt-10 block w-full overflow-hidden border border-white/10"
          style={{ aspectRatio: "16/9" }}
          aria-label={`Play ${featured.title}`}
        >
          <img
            src={featured.source === "cloudinary" ? featured.thumb : `https://picsum.photos/seed/${VIDEOS[0]?.thumb}/1600/900`}
            alt={featured.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gold text-gold-foreground md:h-28 md:w-28">
              <Play size={28} className="ml-1 fill-current" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold" />
            </span>
          </div>
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
            <span className="bg-gold/90 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-gold-foreground">
              Featured Reel
            </span>
            <h3 className="font-display mt-2 text-2xl text-foreground md:text-4xl">{featured.title}</h3>
          </div>
        </button>

        {/* Reel grid */}
        <div className="mt-14">
          <h3 className="font-display text-2xl text-foreground md:text-3xl">Reels & Stories</h3>
          <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
            {allVideos.map((v) => (
              <motion.button
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                onClick={() => setOpenId(v.id)}
                className="group relative w-[80vw] flex-shrink-0 snap-center overflow-hidden border border-white/10 bg-background md:w-auto"
                style={{ aspectRatio: "9/16" }}
                aria-label={`Play ${v.title}`}
              >
                <img
                  src={v.thumb}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gold/95 text-gold-foreground">
                    <Play size={18} className="ml-0.5 fill-current" />
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold" />
                  </span>
                </div>
                <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-gold">
                  {v.badge}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 text-[10px] tracking-widest text-foreground">
                  {v.duration}
                </span>
                <h4 className="absolute bottom-3 left-3 right-16 font-display text-lg text-foreground">
                  {v.title}
                </h4>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/92 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenId(null)}
                aria-label="Close video"
                className="absolute -top-12 right-0 text-gold transition hover:scale-110"
              >
                <X size={28} />
              </button>
              <div className="aspect-video w-full overflow-hidden border border-gold/30 bg-black">
                {open.source === "cloudinary" && open.videoUrl ? (
                  <video
                    src={open.videoUrl}
                    controls
                    autoPlay
                    className="h-full w-full"
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${open.youtubeId}?autoplay=1`}
                    title={open.title}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <h3 className="font-display mt-4 text-2xl text-foreground">{open.title}</h3>
              <p className="text-sm text-muted-foreground">{open.badge} · {open.duration}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
