"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SESSION_TYPES } from "@/data/site";
import { GoldEyebrow } from "./GoldEyebrow";

type FormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  sessionType: string;
  location: string;
  people: number;
  notes: string;
  source: string;
};

export function Booking() {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const onSelect = (title: string) => {
    setSelected(title);
    setValue("sessionType", title);
  };

  const onSubmit = async () => {
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  return (
    <section id="booking" className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <GoldEyebrow center>Work With Me</GoldEyebrow>
          <h2 className="font-display mt-4" style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}>
            Book your session.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Choose your session type and let&apos;s create something unforgettable.
          </p>
        </div>

        {/* Session cards */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {SESSION_TYPES.map((s, i) => {
            const isSel = selected === s.title;
            return (
              <motion.button
                key={s.title}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                onClick={() => onSelect(s.title)}
                className={`group relative text-left bg-surface p-5 transition-all duration-300 ${
                  isSel ? "border border-gold" : "border border-white/8 hover:border-gold/50"
                }`}
              >
                {isSel && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-gold-foreground"
                  >
                    <Check size={14} />
                  </motion.span>
                )}
                <span className="text-2xl">{s.icon}</span>
                <h3 className="font-display mt-3 text-lg text-foreground">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-12 max-w-3xl border border-white/10 bg-surface p-6 md:p-10"
        >
          {status === "success" ? (
            <div className="py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-gold-foreground"
              >
                <Check size={28} />
              </motion.div>
              <h3 className="font-display mt-6 text-2xl text-gold">Thank you!</h3>
              <p className="mt-2 text-sm text-foreground/80">
                I&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name">
                  <input {...register("name", { required: true })} className={inputCls} placeholder="Your name" />
                </Field>
                <Field label="Email">
                  <input type="email" {...register("email", { required: true })} className={inputCls} placeholder="you@email.com" />
                </Field>
                <Field label="Phone">
                  <div className="flex">
                    <span className="grid place-items-center border border-r-0 border-white/10 bg-background px-3 text-sm text-gold">+91</span>
                    <input type="tel" {...register("phone", { required: true })} className={`${inputCls} rounded-none`} placeholder="98765 43210" />
                  </div>
                </Field>
                <Field label="Preferred Date">
                  <input type="date" {...register("date")} className={inputCls} />
                </Field>
                <Field label="Preferred Time">
                  <select {...register("time")} className={inputCls}>
                    <option>Morning (9am–12pm)</option>
                    <option>Afternoon (12pm–4pm)</option>
                    <option>Evening (4pm–7pm)</option>
                  </select>
                </Field>
                <Field label="Session Type">
                  <select {...register("sessionType")} className={inputCls} defaultValue={selected ?? ""}>
                    <option value="" disabled>Select a session</option>
                    {SESSION_TYPES.map((s) => <option key={s.title}>{s.title}</option>)}
                  </select>
                </Field>
                <Field label="Location / Venue">
                  <input {...register("location")} className={inputCls} placeholder="City or venue" />
                </Field>
                <Field label="Number of People">
                  <input type="number" min={1} defaultValue={1} {...register("people")} className={inputCls} />
                </Field>
                <Field label="How did you hear about me?" full>
                  <select {...register("source")} className={inputCls}>
                    <option>Instagram</option>
                    <option>Google</option>
                    <option>Referral</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Special Requests" full>
                  <textarea rows={4} {...register("notes")} className={inputCls} placeholder="Tell me about your vision..." />
                </Field>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="gold-glow mt-8 flex h-14 w-full items-center justify-center bg-gold text-sm uppercase tracking-[0.28em] text-gold-foreground transition active:scale-[0.98] md:w-auto md:px-12"
              >
                {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : "Request a Booking"}
              </button>

              <p className="mt-5 text-xs text-muted-foreground">
                Curious about pricing?{" "}
                <a href="#contact" className="text-gold hover:underline">View packages →</a>
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

const inputCls =
  "w-full bg-background border border-white/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
