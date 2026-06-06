"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Masonry from "react-masonry-css";
import { CATEGORIES, PORTFOLIO, type Category } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

type PortfolioItem = {
  id: number;
  seed: string;
  title: string;
  category: string;
  ratio: string;
  imageUrl?: string;
};

const masonryBreakpoints = {
  default: 3,
  1024: 3,
  768: 2,
  480: 1,
};

export function Portfolio() {
  const [active, setActive] = useState<Category>("All");
  const [visible, setVisible] = useState(9);
  const [items, setItems] = useState<PortfolioItem[]>(
    PORTFOLIO.map((p) => ({ ...p, imageUrl: `https://picsum.photos/seed/${p.seed}/900/1100` }))
  );

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((p) => p.category === active)),
    [active, items]
  );

  const shown = filtered.slice(0, visible);

  return (
    <section id="portfolio" className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4">
          <GoldEyebrow>Selected Works</GoldEyebrow>
          <h2 className="font-display text-4xl md:text-6xl">A frame for every feeling.</h2>
        </div>

        {/* Filter pills */}
        <div className="-mx-5 mt-10 overflow-x-auto px-5 md:mx-0 md:px-0">
          <div className="flex min-w-max gap-2 md:flex-wrap">
            {CATEGORIES.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => { setActive(c); setVisible(9); }}
                  className={`relative h-10 rounded-full border px-5 text-xs uppercase tracking-[0.22em] transition ${
                    isActive
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-white/15 text-foreground/70 hover:border-gold/60 hover:text-gold"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry Grid */}
        <AnimatePresence mode="popLayout">
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="masonry-grid mt-10"
            columnClassName="masonry-grid-column"
          >
            {shown.map((item, i) => (
              <motion.figure
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, delay: (i % 9) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative mb-3 overflow-hidden border-t-2 border-gold/30 bg-surface md:mb-6"
              >
                <img
                  src={item.imageUrl || `https://picsum.photos/seed/${item.seed}/900/1100`}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: item.ratio }}
                  className="w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/0 opacity-60 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block bg-gold/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-gold-foreground">
                    {item.category}
                  </span>
                  <h3 className="font-display mt-2 text-2xl text-foreground">{item.title}</h3>
                </div>
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-100 bg-gold/30 transition-all duration-500 group-hover:bg-gold" />
              </motion.figure>
            ))}
          </Masonry>
        </AnimatePresence>

        {visible < filtered.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + 6)}
              className="border border-gold/70 px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-gold transition hover:bg-gold/10 active:scale-[0.97]"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
