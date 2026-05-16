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

const SITE_URL = "https://soul-skin-website.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Soul Skin — Streetwear from Ulaanbaatar",
    template: "%s | Soul Skin",
  },
  description:
    "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back. Custom orders via Instagram.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soul Skin — Streetwear from Ulaanbaatar",
    description:
      "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back.",
    type: "website",
    url: SITE_URL,
    siteName: "Soul Skin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Soul Skin — Streetwear from Ulaanbaatar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soul Skin — Streetwear from Ulaanbaatar",
    description:
      "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back.",
    images: ["/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: "Soul Skin",
                  url: SITE_URL,
                  logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/og-image.png`,
                  },
                  sameAs: ["https://www.instagram.com/yoursoulskin"],
                  location: {
                    "@type": "Place",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "Ulaanbaatar",
                      addressCountry: "MN",
                    },
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "Soul Skin",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
              ],
            }),
          }}
        />
        {/* Global ultra-thin noise — the ambient grain across the entire site */}
        <div className="noise-global" aria-hidden="true" />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
