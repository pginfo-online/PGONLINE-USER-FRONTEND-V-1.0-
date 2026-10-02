import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PGInfo - Verified PGs, Flats & Commercial Properties in India",
  description: "Discover verified PGs, student hostels, rental flats, and commercial properties across top cities in India with zero hidden brokerage.",
  keywords: ["PGs in Pune", "Hostels", "Rental Flats", "Apartments for Rent", "Commercial Office Space", "Co-living", "PGInfo"],
  authors: [{ name: "PGInfo.online" }],
  creator: "PGInfo.online",
  publisher: "PGInfo.online",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pginfo.online",
    title: "PGInfo.online - Find Your Perfect PG & Unlimited Buffets",
    description: "Discover verified PGs, hostels, co-living spaces, and unlimited buffets at great locations.",
    siteName: "PGInfo.online",
  },
  twitter: {
    card: "summary_large_image",
    title: "PGInfo.online - Find Your Perfect PG",
    description: "Discover verified PGs, hostels, co-living spaces, and unlimited buffets at great locations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-full flex flex-col font-sans text-gray-900 bg-slate-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
