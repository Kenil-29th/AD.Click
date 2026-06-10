"use client";

import { motion } from "framer-motion";
import { AlertCircle, Instagram, Loader2, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { SITE } from "@/data/site";

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_CONTACT = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT!;
const TEMPLATE_REPLY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REPLY!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    try {
      // Step 1: Send notification to owner
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_CONTACT,
        {
          from_name: name,
          user_name: name,
          name: name,
          from_email: email,
          user_email: email,
          email: email,
          reply_to: email,
          message: message,
          to_name: SITE.name,
        },
        PUBLIC_KEY
      );

      // Step 2: Send auto-reply to visitor (non-blocking — don't fail if this errors)
      emailjs.send(
        SERVICE_ID,
        TEMPLATE_REPLY,
        {
          to_name: name,
          user_name: name,
          name: name,
          to_email: email,
          user_email: email,
          email: email,
          reply_to: email,
          from_name: SITE.name,
          message: message,
        },
        PUBLIC_KEY
      ).catch((err) => console.warn("Auto-reply failed:", err));

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
      showToast("success", "Message sent! I'll get back to you soon.");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
      showToast("error", "Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="bg-surface px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl md:text-6xl">Let&apos;s talk.</h2>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Have a project in mind? Drop a message.
        </p>

        {/* Contact info cards */}
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

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="mt-10 grid gap-4 text-left">
          {/* Name */}
          <div>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="Your name"
              className={`w-full bg-background border px-4 py-3 text-sm focus:outline-none transition ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-gold"
              }`}
            />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
              type="email"
              placeholder="Your email"
              className={`w-full bg-background border px-4 py-3 text-sm focus:outline-none transition ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-gold"
              }`}
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors((p) => ({ ...p, message: undefined })); }}
              rows={5}
              placeholder="Tell me about your project..."
              className={`w-full bg-background border px-4 py-3 text-sm focus:outline-none transition ${
                errors.message ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-gold"
              }`}
            />
            {errors.message && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={status === "sending"}
            className="h-14 bg-gold text-sm uppercase tracking-[0.28em] text-gold-foreground transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Sending...
              </span>
            ) : status === "success" ? (
              "✓ Sent — Thank you!"
            ) : (
              "Send Message"
            )}
          </motion.button>
        </form>

        {/* Social links */}
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

      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 right-6 z-50 max-w-sm border px-5 py-4 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-gold/30 bg-surface text-foreground"
              : "border-red-500/30 bg-surface text-red-400"
          }`}
        >
          {toast.text}
        </motion.div>
      )}
    </section>
  );
}
