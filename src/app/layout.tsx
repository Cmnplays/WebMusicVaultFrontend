import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "WebMusicVault",
  description: "Developer - Aaditya",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`relative overflow-x-hidden`}>
        {/* Background Layer - Like your React version */}
        <div className="fixed inset-0 -z-10 bg-[#5520A5]" />

        <Providers>
          <ScrollToTop />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
