import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "WebMusicVault | My Personal Music Collection",
    template: "%s | WebMusicVault",
  },
  description:
    "WebMusicVault - Stream, organize, and discover your favorite music. Create personal playlists and enjoy high-quality audio playback anywhere.",
  keywords: [
    "music",
    "player",
    "streaming",
    "playlist",
    "WebMusicVault",
    "audio",
  ],
  authors: [{ name: "Aaditya" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`relative overflow-x-hidden`}>
        <div className="fixed inset-0 -z-10" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
