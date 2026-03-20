"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useHandleDownload } from "@/hooks/useHandleDownload";
import { setMountDownloadConfirmation } from "@/reduxSlices/ui/uiSlice";
import { useAppDispatch } from "@/store/hook";
import { Button } from "../ui/button";

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
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
    );
  }, []);

  function animateOut(callback?: () => void) {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      duration: 0.3,
      opacity: 0,
      scale: 0.95,
      ease: "power2.in",
      onComplete: () => {
        dispatch(setMountDownloadConfirmation(false));
        callback?.();
      },
    });
  }

  function handleInput(download: boolean) {
    if (download) {
      handleDownload();
      animateOut(onClose);
    } else {
      animateOut();
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-110 flex items-center justify-center bg-background/80 backdrop-blur-md px-4 text-foreground"
      style={{ transformOrigin: "center" }}
    >
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold line-clamp-2 text-foreground">
          Do you want to download <span className="font-bold">{title}</span>?
        </h3>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => handleInput(false)}
            className="min-w-[80px]"
          >
            No
          </Button>
          <Button
            variant="default"
            onClick={() => handleInput(true)}
            className="min-w-[80px]"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadConfirmation;
