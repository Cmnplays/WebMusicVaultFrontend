"use client";

import React from "react";
import Image from "next/image";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SongCoverProps {
  src?: string;
  title: string;
  artist?: string;
  id: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const gradients = [
  "from-purple-600 to-pink-500",
  "from-indigo-600 to-purple-500",
  "from-blue-600 to-cyan-500",
  "from-pink-600 to-rose-500",
  "from-violet-600 to-purple-500",
  "from-cyan-600 to-indigo-500",
  "from-rose-600 to-orange-500",
  "from-purple-700 to-red-500",
  "from-indigo-700 to-pink-500",
  "from-blue-700 to-pink-500",
];

// Helper to get hex colors for syncing with player background
export const getGradientColors = (id: string, title: string) => {
  const index = getSongGradientIndex(id, title);
  const colorMap: Record<number, { from: string; to: string }> = {
    0: { from: "#9333ea", to: "#ec4899" }, // purple-600 to pink-500
    1: { from: "#4f46e5", to: "#a855f7" }, // indigo-600 to purple-500
    2: { from: "#2563eb", to: "#06b6d4" }, // blue-600 to cyan-500
    3: { from: "#db2777", to: "#f43f5e" }, // pink-600 to rose-500
    4: { from: "#7c3aed", to: "#a855f7" }, // violet-600 to purple-500
    5: { from: "#0891b2", to: "#6366f1" }, // cyan-600 to indigo-500
    6: { from: "#e11d48", to: "#f97316" }, // rose-600 to orange-500
    7: { from: "#6d28d9", to: "#ef4444" }, // purple-700 to red-500
    8: { from: "#4338ca", to: "#ec4899" }, // indigo-700 to pink-500
    9: { from: "#1e40af", to: "#ec4899" }, // blue-700 to pink-500
  };

  return colorMap[index] || colorMap[0];
};

// Legacy support for gradientColors array (used in ExpandedPlayer)
export const gradientColors = gradients.map((_, i) => {
  const colorMap: Record<number, string> = {
    0: "#9333ea", 1: "#4f46e5", 2: "#2563eb", 3: "#db2777", 4: "#7c3aed",
    5: "#0891b2", 6: "#e11d48", 7: "#6d28d9", 8: "#4338ca", 9: "#1e40af",
  };
  return colorMap[i];
});

export const getSongGradientIndex = (id: string, title: string) => {
  const hashInput = id || title || "default";
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % gradients.length;
};

const sizeConfig = {
  sm: {
    container: "w-12 h-12",
    initialsSize: "text-lg",
    shadow: "shadow-lg",
  },
  md: {
    container: "w-32 h-32",
    initialsSize: "text-5xl",
    shadow: "shadow-2xl",
  },
  lg: {
    container: "w-full aspect-square max-w-sm",
    initialsSize: "text-7xl",
    shadow: "shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
  },
};

const SongCover: React.FC<SongCoverProps> = ({
  src,
  title,
  artist,
  id,
  className,
  size = "md",
}) => {
  const config = sizeConfig[size];
  const gradientIndex = getSongGradientIndex(id, title);
  const gradientClass = gradients[gradientIndex];
  const colors = getGradientColors(id, title);
  
  const getInitials = (t: string, a?: string) => {
    // Find words that start with a letter or number
    const words = t.trim().split(/\s+/).filter(w => /^[a-zA-Z0-9]/.test(w));
    
    if (words.length >= 2) {
      // Use first letter of first two letter-starting words
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    if (words.length === 1 && words[0].length >= 2) {
      // Use first and second letter of the only word
      return (words[0][0] + words[0][1]).toUpperCase();
    }

    const firstChar = t.trim()?.[0] || "?";
    const artistChar = a?.trim()?.[0] || "";
    return (firstChar + artistChar).toUpperCase().slice(0, 2);
  };

  const initials = getInitials(title, artist);

  return (
    <div
      role={src ? undefined : "img"}
      aria-label={title}
      className={cn(
        "relative rounded-xl overflow-hidden flex items-center justify-center select-none",
        src ? "bg-zinc-900" : cn("bg-gradient-to-br", gradientClass),
        config.container,
        className
      )}
      style={!src ? {
        boxShadow: `0 10px 20px -5px rgba(0, 0, 0, 0.3), 0 20px 40px -10px ${colors.from}44`,
      } : {
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-cover"
        />
      ) : (
        <>
          {/* Single highlight overlay (merged from 3 separate layers) */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 opacity-60 pointer-events-none"></div>

          {/* Main initials content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <p
              className={cn(config.initialsSize, "font-black text-white leading-none")}
              style={{
                letterSpacing: "0.1em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {initials}
            </p>
            {size === "lg" && artist && (
              <p className="mt-4 text-xs font-bold tracking-[0.3em] text-white/40 uppercase text-center max-w-[80%] line-clamp-2">
                {artist}
              </p>
            )}
          </div>

          {/* Border light effect */}
          <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default SongCover;
