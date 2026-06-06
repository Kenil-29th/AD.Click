"use client";

import { motion } from "framer-motion";
import { Home, Grid3x3, Play, Calendar, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { id: "home", label: "Home", icon: Home },
  { id: "portfolio", label: "Portfolio", icon: Grid3x3 },
  { id: "videos", label: "Videos", icon: Play },
  { id: "booking", label: "Book", icon: Calendar },
  { id: "contact", label: "Contact", icon: Mail },
];

export function BottomNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 120 && r.bottom >= 120) {
            setActive(it.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom border-t border-white/8"
      style={{ background: "rgba(10,10,10,0.88)", backdropFilter: "blur(24px)" }}
      aria-label="Mobile navigation"
    >
      <ul className="flex h-16 items-stretch justify-around px-2">
        {items.map((it) => {
          const isActive = active === it.id;
          const Icon = it.icon;
          return (
            <li key={it.id} className="flex-1">
              <a
                href={`#${it.id}`}
                aria-label={it.label}
                className="relative flex h-full flex-col items-center justify-center gap-1"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute top-1 h-1 w-1 rounded-full bg-gold"
                  />
                )}
                <Icon size={22} className={isActive ? "text-gold" : "text-foreground/75"} />
                <span className={`text-[10px] tracking-widest uppercase ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                  {it.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
