"use client";
import Link from "next/link";
import { Music2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#5520A5] text-white overflow-x-hidden">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-4 pt-20 min-h-[calc(100vh-80px)]">
        {/* Background Decorative Circles */}
        <div className="fixed top-1/4 -left-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10 flex flex-col items-center max-w-md w-full text-center">
          <div className="mb-8 relative">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
              <Music2 size={64} className="text-purple-300" />
            </div>
          </div>

          <h1 className="text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-300 leading-none">
            404
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-purple-100 font-outfit">
            Lost in the Rhythm?
          </h2>
          <p className="text-purple-200/70 mb-10 leading-relaxed">
            The track you&apos;re looking for isn&apos;t in our vault. It might
            have been moved or deleted, or the URL might be mistyped.
          </p>

          <Link href="/">
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-purple-100 font-bold gap-2 px-8 rounded-full transition-transform active:scale-95 shadow-xl"
            >
              <Home size={18} />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer Branding */}
        <div className="mt-20 text-purple-300/40 text-sm font-medium tracking-widest uppercase">
          WebMusicVault
        </div>
      </div>
    </div>
  );
}
