import React from "react";
import { setRepeat } from "@/reduxSlices/song/songSlice";
import { useAppDispatch } from "@/store/hook";
import { repeatType } from "@/hooks/useAudioPlayer";
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
    >
      {repeat === "repeat" && (
        <i className="ri-repeat-2-line text-white/90 text-2xl lg:text-3xl" />
      )}
      {repeat === "single" && (
        <i className="ri-repeat-one-line text-white/90 text-2xl lg:text-3xl" />
      )}
      {repeat === "noRepeat" && (
        <div className="relative inline-block">
          <i className="ri-repeat-2-line text-white/40 text-2xl lg:text-3xl" />
          <div className="absolute inset-0 m-auto w-[1.25px] lg:w-[1.5px] h-full bg-white/70 rotate-[-45deg]" />
        </div>
      )}
    </button>
  );
};

export default RepeatBtn;
