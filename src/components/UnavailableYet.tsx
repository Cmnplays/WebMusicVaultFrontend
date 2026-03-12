"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const UnavailableYet: React.FC = () => {
  const router = useRouter();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{ fontFamily: "'Courier New', monospace" }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-white"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
      />

      <div className="relative z-10 text-center px-6">
        <Badge
          variant="outline"
          className="mb-6 tracking-[0.3em] text-purple-400 border-purple-500/40 uppercase text-xs"
        >
          WebMusicVault
        </Badge>

        <h1
          className="text-7xl md:text-9xl font-black uppercase leading-none mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          Soon
          <span className="text-purple-500">{dots}</span>
        </h1>

        <Separator className="w-16 mx-auto my-6 bg-purple-500/50" />

        <p className="text-muted-foreground text-sm tracking-widest uppercase mb-10">
          This feature is being composed
        </p>

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="tracking-widest uppercase border-white/20 hover:border-purple-500 hover:text-purple-400 hover:bg-transparent transition-all duration-300"
        >
          ← Go Back
        </Button>
      </div>
    </main>
  );
};

export default UnavailableYet;
