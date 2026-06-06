"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <footer className="border-t border-gold/30 bg-background px-5 py-8 pb-28 md:px-10 md:pb-8">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
          <span className="font-display text-xl text-foreground">
            AD.<span className="text-gold">CLICKSS</span>
          </span>
          <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            © 2025 All Rights Reserved
          </span>
        </div>
      </footer>

      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-24 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-gold text-gold-foreground shadow-lg transition active:scale-95 md:bottom-8 md:right-8"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
