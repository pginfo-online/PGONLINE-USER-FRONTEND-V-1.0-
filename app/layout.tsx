import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "../contexts/AuthContext";

export const metadata: Metadata = {
  title: "PGInfo.online - Find Your Perfect PG & Unlimited Buffets",
  description: "Find your perfect PG, feel like home. Discover verified PGs, hostels, co-living spaces, and unlimited buffets at great locations.",
  keywords: ["PG in Pune", "Hostels", "Co-living", "Unlimited Buffets", "Dining", "Rooms for rent", "Student accommodation", "PGInfo"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-full flex flex-col font-sans text-gray-900 bg-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
