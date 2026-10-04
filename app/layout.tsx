import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";
import "./editorial.css";

// Two families only: Bebas Neue for display, Inter for everything else.
// Monospace falls back to the system font and is reserved for numeric data.
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://soul-skin-website.vercel.app";

// Matches the page background so the browser chrome does not flash white.
export const viewport: Viewport = {
  themeColor: "#0a0908",
};

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
      className={`${bebasNeue.variable} ${inter.variable}`}
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
        <a href="#main" className="skip-link">Skip to content</a>
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
