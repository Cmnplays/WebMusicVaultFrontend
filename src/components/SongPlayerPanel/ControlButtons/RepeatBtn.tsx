"use client";
import React from "react";
import { useAppDispatch } from "@/store/hook";
import { setRepeat } from "@/reduxSlices/player/playerSlice";
import { repeatType } from "@/hooks/useAudioPlayer";
import { Repeat, Repeat1 } from "lucide-react";

interface RepeatBtnProps {
  repeat: repeatType;
}

const RepeatBtn: React.FC<RepeatBtnProps> = ({ repeat }) => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        if (repeat === "repeat") dispatch(setRepeat("single"));
        else if (repeat === "single") dispatch(setRepeat("noRepeat"));
        else dispatch(setRepeat("repeat"));
      }}
      aria-label={`Repeat mode: ${repeat}`}
      className="
        relative flex items-center justify-center
        w-10 h-10 lg:w-12 lg:h-12
        rounded-full
        hover:bg-white/10
        active:scale-95
        transition-transform transition-colors
      "
    >
      {repeat === "repeat" && <Repeat size={24} />}
      {repeat === "single" && <Repeat1 size={24} />}
      {repeat === "noRepeat" && (
        <div className="relative flex items-center justify-center">
          <Repeat size={24} className="stroke-white/40" />
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: "rotate(-45deg)" }}
          >
            <span className="block w-[1.5px] h-6 lg:h-7 bg-white/70"></span>
          </span>
        </div>
      )}
    </button>
  );
};

export default RepeatBtn;
