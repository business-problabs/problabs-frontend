import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Florida Lottery Data & Probability | Probability AI Labs",
  description:
    "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, Pick 5, and Cash Pop. No hype. No guarantees.",

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
      "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, Pick 5, and Cash Pop. No hype. No guarantees.",
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

  twitter: {
    card: "summary_large_image",
    title: "Florida Lottery Data & Probability | Probability AI Labs",
    description:
      "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, Pick 5, and Cash Pop. No hype. No guarantees.",
    images: ["https://www.problabs.net/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Probability AI Labs",
    url: "https://www.problabs.net",
    logo: "https://www.problabs.net/icon.png",
    description:
      "Probability AI Labs provides Florida Lottery data analysis, probability research, and educational insights. We focus exclusively on Florida lottery games using statistical modeling and historical data. No predictions or guarantees are made.",
    areaServed: { "@type": "AdministrativeArea", name: "Florida" },
    knowsAbout: [
      "Florida Lottery",
      "Lottery probability analysis",
      "Statistical modeling",
      "Data analytics",
      "Random number theory",
    ],
    publisher: { "@type": "Organization", name: "Probability AI Labs" },
  };

  return (
    <html lang="en">
      <body>
        {/* Cloudflare Turnstile */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />

        <Script
          id="jsonld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        {children}
      </body>
    </html>
  );
}

