import type { Metadata, Viewport } from "next";
import { Fraunces, Oswald, Outfit } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Encore",
    template: "%s · Encore",
  },
  description:
    "Concert discovery prototype for Brad Griffith in Woodinville and Seattle. The September 2026 slate is a fictional seed.",
  applicationName: "Encore",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${oswald.variable} ${fraunces.variable}`}>
      <body className="bg-[#070605] font-sans text-paper antialiased">
        <div className="phone-bg relative mx-auto min-h-dvh w-full max-w-phone border-x border-white/10">
          <main className="relative z-10 min-h-dvh">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
