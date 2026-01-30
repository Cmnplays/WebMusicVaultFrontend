"use client";
import React from "react";
import { Play, Pause } from "lucide-react";

interface PlayPauseSongProps {
  playing: boolean;
  handlePlayPause: () => void;
}

const PlayPauseSong: React.FC<PlayPauseSongProps> = ({
  playing,
  handlePlayPause,
}) => {
  return (
    <button
      aria-label={playing ? "Pause" : "Play"}
      onClick={handlePlayPause}
      className="
        flex items-center justify-center
        w-14 h-14 lg:w-16 lg:h-16
        rounded-full
        bg-gradient-to-tr from-orange-400 to-purple-600
        hover:bg-gradient-to-tr hover:from-orange-500 hover:to-purple-700
        active:scale-95
        transition-transform transition-colors
      "
    >
      {playing ? (
        <Pause size={32} className="stroke-white" />
      ) : (
        <Play size={32} className="stroke-white" />
      )}
    </button>
  );
};

export default PlayPauseSong;
