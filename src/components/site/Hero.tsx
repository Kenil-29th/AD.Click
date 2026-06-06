"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function Particles() {
  const particles = Array.from({ length: 20 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 0.7) % 8;
        const dur = 8 + ((i * 3) % 8);
        return (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-gold/40"
            style={{
              left: `${left}%`,
              bottom: "-10vh",
              animation: `particle-rise ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0 animate-ken-burns">
        <img
          src="https://picsum.photos/seed/ad-hero-portrait/1600/2400"
          alt="Cinematic portrait shot by AD.CLICKSS"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.35)_60%,transparent_100%)]" />
      <Particles />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 md:px-16 md:pb-32">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="label-eyebrow"
        >
          Surat, India — Visual Storyteller
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mt-4 leading-[0.95] text-foreground"
          style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)" }}
        >
          AD.<span className="text-gold italic">CLICKSS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.7 }}
          className="mt-4 max-w-md text-base text-foreground/80 md:text-lg"
        >
          Photography that tells your story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.0 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href="#booking"
            className="gold-glow flex h-14 items-center justify-center bg-gold px-8 text-xs uppercase tracking-[0.28em] text-gold-foreground transition active:scale-[0.97]"
          >
            Book a Session
          </a>
          <a
            href="#portfolio"
            className="flex h-14 items-center justify-center border border-gold/70 px-8 text-xs uppercase tracking-[0.28em] text-gold transition hover:bg-gold/10 active:scale-[0.97]"
          >
            View Portfolio
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#portfolio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 md:bottom-8"
        aria-label="Scroll to portfolio"
      >
        <ChevronDown className="animate-scroll-bounce text-gold" size={22} />
      </motion.a>
    </section>
  );
}
