"use client";

import { motion } from "framer-motion";

export function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.6, delay: 1.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display text-gold text-7xl md:text-8xl"
      >
        AD
      </motion.h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="my-5 h-px bg-gold"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="label-eyebrow text-muted-foreground"
      >
        ad.clickss
      </motion.span>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold"
      />
    </motion.div>
  );
}
