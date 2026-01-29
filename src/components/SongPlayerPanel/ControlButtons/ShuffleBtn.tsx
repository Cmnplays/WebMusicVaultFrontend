"use client";
import { useAppDispatch } from "@/store/hook";
import { setShuffle } from "@/reduxSlices/song/songSlice";
import React from "react";
interface ShuffleBtnProps {
  shuffle: boolean;
}
const ShuffleBtn: React.FC<ShuffleBtnProps> = ({ shuffle }) => {
  const dispatch = useAppDispatch();

  return (
    <button className="relative" onClick={() => dispatch(setShuffle())}>
      {shuffle ? (
        <i className="ri-shuffle-line text-white/90 text-2xl lg:text-3xl" />
      ) : (
        <div className="relative inline-block">
          <i className="ri-shuffle-line text-white/40 text-2xl lg:text-3xl" />
          <div className="absolute inset-0 m-auto w-[1.25px] lg:w-[1.5px] h-full bg-white/70 rotate-[-45deg]" />
        </div>
      )}
    </button>
  );
};

export default ShuffleBtn;
