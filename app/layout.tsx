import type { Metadata } from "next";
import {
  Bebas_Neue,
  Inter,
  Playfair_Display,
  Space_Mono,
} from "next/font/google";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Editorial italic accent — used sparingly for tags, captions, pull quotes.
const playfair = Playfair_Display({
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soul Skin — Streetwear from Ulaanbaatar",
  description:
    "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back. Custom orders via Instagram.",
  openGraph: {
    title: "Soul Skin — Streetwear from Ulaanbaatar",
    description:
      "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${playfair.variable} ${spaceMono.variable}`}
    >
      <body className="bg-void text-bone font-sans overflow-x-hidden">
        {/* Global ultra-thin noise — the ambient grain across the entire site */}
        <div className="noise-global" aria-hidden="true" />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
