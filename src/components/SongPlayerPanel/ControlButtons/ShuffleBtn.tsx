"use client";
import { useAppDispatch } from "@/store/hook";
import { setShuffle } from "@/reduxSlices/player/player.slice";
import React from "react";
import { Shuffle } from "lucide-react";

interface ShuffleBtnProps {
  shuffle: boolean;
}

const ShuffleBtn: React.FC<ShuffleBtnProps> = ({ shuffle }) => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(setShuffle())}
      aria-label={`Shuffle ${shuffle ? "On" : "Off"}`}
      className="
        relative flex items-center justify-center
        w-10 h-10 lg:w-12 lg:h-12
        rounded-full
        hover:bg-white/10
        active:scale-95
        transition-transform transition-colors
      "
    >
      {/* Shuffle icon */}
      <Shuffle
        size={24} // Matches Skip buttons icon size
        className={`stroke-white transition-colors duration-200 ${
          shuffle ? "stroke-white" : "stroke-white/40"
        }`}
      />

      {/* Strike-through line when shuffle is off */}
      {!shuffle && (
        <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-100">
          <span className="block w-[1.5px] h-6 lg:h-7 bg-white/70 rotate-[-45deg]"></span>
        </span>
      )}
    </button>
  );
};

export default ShuffleBtn;
