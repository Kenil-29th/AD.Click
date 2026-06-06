import type { Metadata } from "next";
import { HomePage } from "@/components/site/HomePage";

export const metadata: Metadata = {
  title: "AD.CLICKSS — Cinematic Photographer | Surat, India",
  description:
    "Photography that tells your story. Portraits, pre-weddings, automotive, fashion, and events by AD.CLICKSS in Surat, India.",
  openGraph: {
    title: "AD.CLICKSS — Cinematic Photographer",
    description: "Surat-based visual storyteller. Book your session today.",
    images: ["https://picsum.photos/seed/ad-hero-portrait/1600/900"],
  },
};

export default function Page() {
  return <HomePage />;
}
