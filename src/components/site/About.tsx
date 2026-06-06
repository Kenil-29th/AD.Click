"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="font-display text-5xl text-gold md:text-6xl">
      {n}
      {suffix}
    </span>
  );
}

const STATS = [
  { n: 5, label: "Years Experience" },
  { n: 300, label: "Sessions" },
  { n: 50, label: "Videos" },
  { n: 15, label: "Cities" },
];

export function About() {
  return (
    <section id="about" className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative">
            <img
              src="https://picsum.photos/seed/ad-photographer/900/1100"
              alt="AD.CLICKSS photographer portrait"
              className="w-full"
              style={{ aspectRatio: "4/5", objectFit: "cover", outline: "1.5px solid var(--color-gold)", outlineOffset: "10px" }}
            />
          </div>
          <p className="mt-6 ml-2 label-eyebrow text-muted-foreground">
            AD.CLICKSS · {SITE.location}
          </p>
        </motion.div>

        <div>
          <GoldEyebrow>The Photographer</GoldEyebrow>
          <h2 className="font-display mt-3 text-4xl md:text-6xl">The Vision</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/80">
            <p>
              I&apos;m a photographer based in Surat, India, obsessed with light, emotion, and the
              stories that live between moments. What started as curiosity with a camera has grown
              into a full creative practice spanning portraits, weddings, automotive, fashion, and
              beyond.
            </p>
            <p>
              Every click is intentional. Every frame is crafted. Whether it&apos;s the quiet tears at a
              wedding altar, the roar of a throttle on open road, or the laughter at a birthday
              celebration — I&apos;m there to freeze it forever.
            </p>
            <p>
              Follow my journey on Instagram{" "}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                @{SITE.handle} →
              </a>{" "}
              and let&apos;s create something unforgettable together.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <Counter to={s.n} />
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
