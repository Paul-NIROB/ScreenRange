import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScreenRange",
  description:
    "Give every character performance a RangeScore and track screen time in movies and shows.",
  openGraph: {
    title: "ScreenRange",
    description:
      "Give every character performance a RangeScore. Explore community scores, screen time and reviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}