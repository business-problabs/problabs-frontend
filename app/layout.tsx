import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.problabs.net"),
  title: "ProbLabs",
  description: "AI-Powered Lottery Intelligence",
  icons: {
    icon: [
      { url: "/branding/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Probability AI Labs",
    description: "Florida-only, data-backed lottery analytics. No hype. No guarantees.",
    url: "https://www.problabs.net",
    siteName: "ProbLabs",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Probability AI Labs — AI-Powered Lottery Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Probability AI Labs",
    description: "Florida-only, data-backed lottery analytics. No hype. No guarantees.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

