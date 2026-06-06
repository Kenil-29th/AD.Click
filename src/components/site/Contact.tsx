"use client";

import { motion } from "framer-motion";
import { Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/data/site";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="bg-surface px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl md:text-6xl">Let&apos;s talk.</h2>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Have a project in mind? Drop a message.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <a href={`mailto:${SITE.email}`} className="flex flex-col items-center gap-2 border border-white/10 bg-background p-6 transition hover:border-gold/60">
            <Mail size={20} className="text-gold" />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Email</span>
            <span className="text-sm text-foreground">{SITE.email}</span>
          </a>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-2 border border-white/10 bg-background p-6 transition hover:border-gold/60">
            <Phone size={20} className="text-gold" />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Phone</span>
            <span className="text-sm text-foreground">{SITE.phone}</span>
          </a>
          <div className="flex flex-col items-center gap-2 border border-white/10 bg-background p-6">
            <MapPin size={20} className="text-gold" />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Location</span>
            <span className="text-sm text-foreground">{SITE.location}</span>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="mt-10 grid gap-4 text-left"
        >
          <input required placeholder="Your name" className="bg-background border border-white/10 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
          <input required type="email" placeholder="Your email" className="bg-background border border-white/10 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
          <textarea required rows={5} placeholder="Tell me about your project..." className="bg-background border border-white/10 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="h-14 bg-gold text-sm uppercase tracking-[0.28em] text-gold-foreground transition"
          >
            {sent ? "✓ Sent — Thank you!" : "Send Message"}
          </motion.button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-5">
          {[
            { href: SITE.instagram, icon: Instagram, label: "Instagram" },
            { href: SITE.whatsapp, icon: MessageCircle, label: "WhatsApp" },
            { href: SITE.youtube, icon: Youtube, label: "YouTube" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-11 w-11 place-items-center border border-white/15 text-foreground/80 transition hover:border-gold hover:text-gold"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
