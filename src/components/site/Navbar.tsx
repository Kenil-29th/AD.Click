"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const links = [
  { id: "home", label: "Home" },
  { id: "portfolio", label: "Portfolio" },
  { id: "videos", label: "Videos" },
  { id: "about", label: "About" },
  { id: "booking", label: "Booking" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 120], ["rgba(10,10,10,0)", "rgba(10,10,10,0.92)"]);
  const blur = useTransform(scrollY, [0, 120], ["blur(0px)", "blur(16px)"]);

  return (
    <motion.header
      style={{ background: bg, backdropFilter: blur as unknown as string }}
      className="fixed top-0 left-0 right-0 z-50 hidden md:block border-b border-transparent"
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-10">
        <a href="#home" className="font-display text-2xl tracking-wide text-foreground">
          AD.<span className="text-gold">CLICKSS</span>
        </a>
        <nav>
          <ul className="flex items-center gap-9">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="group relative text-xs uppercase tracking-[0.22em] text-foreground/80 transition hover:text-foreground"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
            <li>
              <a
                href="#booking"
                className="border border-gold px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-gold transition hover:bg-gold hover:text-gold-foreground"
              >
                Book Now
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
