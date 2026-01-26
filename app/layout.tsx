import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Florida Lottery Data & Probability | Probability AI Labs",
  description:
    "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",

  icons: {
    icon: [
      { url: "/branding/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/branding/apple-touch-icon.png" }],
  },

  openGraph: {
    title: "Florida Lottery Data & Probability | Probability AI Labs",
    description:
      "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",
    url: "https://www.problabs.net",
    siteName: "Probability AI Labs",
    images: [
      {
        url: "https://www.problabs.net/og.png",
        width: 1200,
        height: 630,
        alt: "Probability AI Labs",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Still named "twitter" in metadata spec even though the brand is X
  twitter: {
    card: "summary_large_image",
    title: "Florida Lottery Data & Probability | Probability AI Labs",
    description:
      "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",
    images: ["https://www.problabs.net/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Probability AI Labs",
  url: "https://www.problabs.net",
  logo: "https://www.problabs.net/branding/logo-icon.png",
  description:
    "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",
  areaServed: { "@type": "AdministrativeArea", name: "Florida" },
  knowsAbout: [
    "Florida Lottery",
    "Lottery probability analysis",
    "Statistical modeling",
    "Data analytics",
    "Random number theory",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // IMPORTANT: keep it server-rendered so curl can see it
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

