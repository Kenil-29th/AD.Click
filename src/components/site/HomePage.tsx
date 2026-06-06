"use client";

import { Preloader } from "./Preloader";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Hero } from "./Hero";
import { Portfolio } from "./Portfolio";
import { Videos } from "./Videos";
import { About } from "./About";
import { Services } from "./Services";
import { Booking } from "./Booking";
import { Testimonials } from "./Testimonials";
import { InstagramFeed } from "./Instagram";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

export function HomePage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Preloader />
      <Navbar />
      <Hero />
      <Portfolio />
      <Videos />
      <About />
      <Services />
      <Booking />
      <Testimonials />
      <InstagramFeed />
      <Contact />
      <Footer />
      <BottomNav />
    </main>
  );
}
