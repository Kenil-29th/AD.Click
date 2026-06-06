export const SITE = {
  name: "AD.CLICKSS",
  handle: "ad.clickss",
  instagram: "https://www.instagram.com/ad.clickss",
  location: "Surat, Gujarat, India",
  email: "hello@adclickss.com",
  phone: "+91 98765 43210",
  whatsapp: "https://wa.me/919876543210",
  youtube: "https://youtube.com/@adclickss",
};

export const CATEGORIES = [
  "All", "Portrait", "Pre-Wedding", "Car", "Birthday", "Fashion", "Events", "Editorial",
] as const;

export type Category = typeof CATEGORIES[number];

export const PORTFOLIO: { id: number; seed: string; title: string; category: Exclude<Category, "All">; ratio: string }[] = [
  { id: 1, seed: "ad-portrait-01", title: "Quiet Hour", category: "Portrait", ratio: "4/5" },
  { id: 2, seed: "ad-prewed-01", title: "Two Hearts", category: "Pre-Wedding", ratio: "1/1" },
  { id: 3, seed: "ad-car-01", title: "Midnight Throttle", category: "Car", ratio: "16/9" },
  { id: 4, seed: "ad-bday-01", title: "Twenty-Five", category: "Birthday", ratio: "4/5" },
  { id: 5, seed: "ad-fashion-01", title: "Velvet Edit", category: "Fashion", ratio: "1/1" },
  { id: 6, seed: "ad-event-01", title: "Sangeet Lights", category: "Events", ratio: "16/9" },
  { id: 7, seed: "ad-editorial-01", title: "Inkbloom", category: "Editorial", ratio: "4/5" },
  { id: 8, seed: "ad-portrait-02", title: "Goldenrod", category: "Portrait", ratio: "1/1" },
  { id: 9, seed: "ad-prewed-02", title: "Monsoon Vows", category: "Pre-Wedding", ratio: "16/9" },
  { id: 10, seed: "ad-car-02", title: "Coupe Noir", category: "Car", ratio: "4/5" },
  { id: 11, seed: "ad-fashion-02", title: "Smoke & Silk", category: "Fashion", ratio: "1/1" },
  { id: 12, seed: "ad-event-02", title: "Reception Glow", category: "Events", ratio: "16/9" },
  { id: 13, seed: "ad-portrait-03", title: "Cinematic II", category: "Portrait", ratio: "4/5" },
  { id: 14, seed: "ad-editorial-02", title: "Marble Hour", category: "Editorial", ratio: "1/1" },
  { id: 15, seed: "ad-bday-02", title: "Sweet Sixteen", category: "Birthday", ratio: "16/9" },
  { id: 16, seed: "ad-car-03", title: "Garage Light", category: "Car", ratio: "4/5" },
  { id: 17, seed: "ad-portrait-04", title: "Window Soft", category: "Portrait", ratio: "1/1" },
  { id: 18, seed: "ad-fashion-03", title: "After Show", category: "Fashion", ratio: "16/9" },
];

export const VIDEOS = [
  { id: "v1", title: "Cinematic Pre-Wedding Film", badge: "SHORT FILM", duration: "2:14", youtubeId: "dQw4w9WgXcQ", thumb: "ad-video-01" },
  { id: "v2", title: "Behind the Scenes — Studio Day", badge: "BTS", duration: "1:08", youtubeId: "dQw4w9WgXcQ", thumb: "ad-video-02" },
  { id: "v3", title: "Automotive Shoot BTS", badge: "BTS", duration: "0:58", youtubeId: "dQw4w9WgXcQ", thumb: "ad-video-03" },
  { id: "v4", title: "Birthday Highlights", badge: "REEL", duration: "0:45", youtubeId: "dQw4w9WgXcQ", thumb: "ad-video-04" },
  { id: "v5", title: "Fashion Editorial BTS", badge: "BTS", duration: "1:32", youtubeId: "dQw4w9WgXcQ", thumb: "ad-video-05" },
  { id: "v6", title: "Event Coverage — Highlight Reel", badge: "EVENT COVERAGE", duration: "2:50", youtubeId: "dQw4w9WgXcQ", thumb: "ad-video-06" },
];

export const SESSION_TYPES = [
  { icon: "🎂", title: "Birthday Shoot", desc: "Celebrate your special day with stunning portraits" },
  { icon: "🚗", title: "Car & Automotive", desc: "Premium shots for your prized vehicle" },
  { icon: "💍", title: "Pre-Wedding", desc: "Romantic stories before the big day" },
  { icon: "💒", title: "Wedding Day", desc: "Full-day coverage of your forever moment" },
  { icon: "👶", title: "Maternity & Baby", desc: "Tender portraits of new beginnings" },
  { icon: "👔", title: "Corporate / Headshots", desc: "Professional portraits for your brand" },
  { icon: "🎓", title: "Graduation", desc: "Mark your achievement with timeless photos" },
  { icon: "🏠", title: "Real Estate", desc: "Architectural and interior photography" },
  { icon: "🎭", title: "Fashion / Editorial", desc: "High-concept editorial and lookbook shoots" },
  { icon: "🌄", title: "Landscape / Nature", desc: "Fine art landscape and outdoor photography" },
  { icon: "🎉", title: "Events & Parties", desc: "Capture every memorable moment" },
  { icon: "📦", title: "Product Photography", desc: "Compelling shots for your brand or store" },
];

export const SERVICES = [
  { icon: "📸", title: "Portrait Sessions", desc: "Expressive, editorial-grade portraits" },
  { icon: "💍", title: "Pre-Wedding", desc: "Romantic stories before the big day" },
  { icon: "💒", title: "Wedding Day", desc: "Full-day cinematic coverage" },
  { icon: "🚗", title: "Automotive", desc: "Premium shots for your prized machine" },
  { icon: "🎂", title: "Birthday Shoots", desc: "Celebrate your milestone in style" },
  { icon: "👔", title: "Corporate", desc: "Professional portraits for your brand" },
  { icon: "🎓", title: "Graduation", desc: "Timeless portraits of your achievement" },
  { icon: "🎭", title: "Fashion / Editorial", desc: "High-concept lookbook and editorial" },
  { icon: "🎉", title: "Events & Parties", desc: "Every moment, captured" },
  { icon: "📦", title: "Product", desc: "Clean, commercial-grade visuals" },
];

export const TESTIMONIALS = [
  { name: "Priya & Arjun", session: "Pre-Wedding", text: "AD made us feel completely at ease. Every frame looks like it belongs in a magazine. Worth every rupee." },
  { name: "Rohit Mehta", session: "Automotive", text: "He shot my GT-R like it was a film poster. The garage light series is now framed in my office." },
  { name: "Aanya Shah", session: "Birthday Shoot", text: "Honestly the best birthday gift I gave myself. The reels he cut still get DMs months later." },
  { name: "Karan Patel", session: "Wedding Day", text: "Full day, never missed a moment. The candid frames of my dad still make me cry." },
  { name: "Neha Iyer", session: "Fashion Editorial", text: "Working with AD is like collaborating with a co-director. He brings ideas, not just a camera." },
  { name: "Vivaan & Riya", session: "Event Coverage", text: "Our sangeet looked like a Karan Johar production. Guests are still asking who shot it." },
];

export const INSTA = Array.from({ length: 8 }).map((_, i) => `ad-insta-${i + 1}`);
