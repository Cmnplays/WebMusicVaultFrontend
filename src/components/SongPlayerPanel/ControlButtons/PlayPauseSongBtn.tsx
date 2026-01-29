"use client";

import React from "react";
interface PlayPauseSongProps {
  playing: boolean;
  handlePlayPause: () => void;
}
const PlayPauseSong: React.FC<PlayPauseSongProps> = ({
  playing = false,
  handlePlayPause,
}) => {
  return (
    <button
      aria-label={playing ? "Pause" : "Play"}
      onClick={handlePlayPause}
      className="
              rounded-full bg-gradient-to-tr from-orange-400 to-purple-600
              flex items-center justify-center text-white
              shadow-lg hover:scale-110 active:scale-95 transition-transform
              w-14 h-14 lg:w-16 lg:h-16
            "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-white w-7 h-7 lg:w-9 lg:h-9"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        {playing ? (
          <>
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </>
        ) : (
          <>
            <path d="M8 5v14l11-7L8 5z" />
          </>
        )}
      </svg>
    </button>
  );
};

export default PlayPauseSong;
