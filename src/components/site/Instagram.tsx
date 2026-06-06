"use client";

import { Heart, Instagram as IGIcon, MessageCircle } from "lucide-react";
import { INSTA, SITE } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

export function InstagramFeed() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <GoldEyebrow>Follow the Journey</GoldEyebrow>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="font-display mt-3 inline-block text-4xl text-foreground transition hover:text-gold md:text-6xl"
        >
          @{SITE.handle}
        </a>

        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          {INSTA.map((seed, i) => (
            <a
              key={seed}
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden border border-white/8"
            >
              <img
                src={`https://picsum.photos/seed/${seed}/600/600`}
                alt={`Instagram post ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 grid place-items-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-5 text-foreground">
                  <span className="flex items-center gap-1.5"><Heart size={16} className="fill-current" />{120 + i * 23}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle size={16} />{8 + i}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-gold/70 px-7 py-4 text-xs uppercase tracking-[0.28em] text-gold transition hover:bg-gold/10"
          >
            <IGIcon size={16} />
            Follow on Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
