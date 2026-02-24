"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { setMountShareModal } from "@/reduxSlices/song/songSlice";
import { useAppDispatch } from "@/store/hook";
interface ShareSongProps {
  title: string;
  songId: string;
}

const ShareSongModal: React.FC<ShareSongProps> = ({ title, songId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();

  // Generate share link
  const shareLink = `${window.location.origin}/music/play/${songId}`;

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
    );
  }, []);

  const closeWithAnimation = () => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        dispatch(setMountShareModal(false));
      },
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4 text-foreground"
    >
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold line-clamp-2">
          Share <span className="font-bold">{title}</span>
        </h3>

        {/* Share Link Box */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1 rounded-md bg-input px-3 py-2 text-sm border border-border text-muted-foreground"
          />

          <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={closeWithAnimation}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareSongModal;
