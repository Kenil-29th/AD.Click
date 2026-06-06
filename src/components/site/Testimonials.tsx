"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

export function Testimonials() {
  return (
    <section className="bg-surface px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <GoldEyebrow>Kind Words</GoldEyebrow>
        <h2 className="font-display mt-3 text-4xl md:text-6xl">From the frame to the feed.</h2>

        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="relative w-[85vw] flex-shrink-0 snap-center border border-white/10 bg-background p-7 md:w-auto"
            >
              <span className="font-display absolute -top-2 left-5 text-6xl leading-none text-gold">&ldquo;</span>
              <blockquote className="mt-6 font-display text-xl italic leading-snug text-foreground">
                {t.text}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.session}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-gold text-gold" />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
