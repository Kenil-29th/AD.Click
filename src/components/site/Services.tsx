"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

export function Services() {
  return (
    <section id="services" className="bg-surface px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <GoldEyebrow>What I Offer</GoldEyebrow>
        <h2 className="font-display mt-3 text-4xl md:text-6xl">Services & sessions.</h2>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group relative border border-white/8 bg-background p-5 transition-all duration-500 hover:border-gold/60 md:p-7"
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-display mt-4 text-xl text-foreground md:text-2xl">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">{s.desc}</p>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
