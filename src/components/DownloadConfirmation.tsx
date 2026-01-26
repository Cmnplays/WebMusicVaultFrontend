"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useHandleDownload } from "../hooks/useHandleDownload";
import { setMountDownloadConfirmation } from "../reduxSlices/song/songSlice";
import { useAppDispatch } from "../store/hook";
interface DownloadConfirmationProps {
  title: string;
  onClose?: () => void;
}

const DownloadConfirmation: React.FC<DownloadConfirmationProps> = ({
  title,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const handleDownload = useHandleDownload();
  useEffect(() => {
    if (containerRef.current && typeof window !== "undefined") {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
      );
    }
  }, []);
  function handleInput(download: boolean) {
    if (download) {
      handleDownload();
      if (!containerRef.current || typeof window === "undefined") return;
      gsap.to(containerRef.current, {
        duration: 0.4,
        opacity: 0,
        scale: 0.95,
        ease: "power2.in",
        onComplete: () => {
          if (onClose) onClose();
        },
      });
    }
    dispatch(setMountDownloadConfirmation(false));
  }
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-50 px-4 text-black"
      style={{ transformOrigin: "center" }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-black line-clamp-2">
          Do you want to download <span className="font-bold">{title}</span>?
        </h3>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleInput(false)}
            className="flex-1/3 px-4 py-2 rounded text-black bg-gray-300 hover:bg-gray-400 shadow-sm hover:shadow-md transition"
          >
            No
          </button>
          <button
            onClick={() => handleInput(true)}
            className="flex-1/3 px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadConfirmation;
