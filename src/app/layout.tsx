import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource/playball/400.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RESTAURANT } from "@/data/restaurant";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: `${RESTAURANT.name} — ${RESTAURANT.tagline}`,
    template: `%s · ${RESTAURANT.name}`,
  },
  description:
    "A luxury live-fire restaurant serving dry-aged steaks, day-boat seafood and seasonal plates. Explore the menu and reserve your table.",
  applicationName: RESTAURANT.name,
  icons: {
    icon: RESTAURANT.favicon,
    apple: RESTAURANT.favicon,
  },
};

export const viewport: Viewport = {
  themeColor: "#100C09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
