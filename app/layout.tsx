import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Probability AI Labs",
  description:
    "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",
  icons: {
    icon: [
      { url: "/branding/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Probability AI Labs",
    description:
      "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",
    url: "https://www.problabs.net",
    siteName: "Probability AI Labs",
    images: [
      {
        url: "/og.png",
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
    title: "Probability AI Labs",
    description:
      "Florida-only, data-backed lottery analytics for Fantasy 5, Pick 3, Pick 4, and Cash Pop. No hype. No guarantees.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

