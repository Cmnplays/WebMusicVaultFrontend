"use client";
import React from "react";
import { SkipBack, SkipForward } from "lucide-react";

interface MoveToSongProps {
  toNext?: boolean;
  moveToFunction: () => void;
}

const MoveToSong: React.FC<MoveToSongProps> = ({
  toNext = true,
  moveToFunction,
}) => {
  return (
    <button
      onClick={moveToFunction}
      aria-label={toNext ? "Next" : "Previous"}
      className="
        flex items-center justify-center
        w-12 h-12 lg:w-14 lg:h-14
        rounded-full
        hover:bg-white/10
        active:scale-95
        transition-transform transition-colors
      "
    >
      {toNext ? (
        <SkipForward size={30} className="stroke-white" />
      ) : (
        <SkipBack size={30} className="stroke-white" />
      )}
    </button>
  );
};

export default MoveToSong;
