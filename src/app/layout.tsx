import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AD.CLICKSS — Cinematic Photography | Surat, India",
  description:
    "AD.CLICKSS — Surat-based visual storyteller specializing in portraits, pre-weddings, automotive, fashion, and events. Book your session.",
  authors: [{ name: "AD.CLICKSS" }],
  openGraph: {
    title: "AD.CLICKSS — Cinematic Photography",
    description:
      "Photography that tells your story. Portraits, weddings, automotive, fashion — Surat, India.",
    type: "website",
    images: ["https://picsum.photos/seed/ad-hero-portrait/1600/900"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ad.clickss",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
