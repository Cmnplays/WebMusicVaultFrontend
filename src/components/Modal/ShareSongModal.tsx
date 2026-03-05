"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { setMountShareModal } from "@/reduxSlices/song/songSlice";
import { useAppDispatch } from "@/store/hook";
import { Copy, Check, X } from "lucide-react";

interface ShareSongProps {
  title: string;
  songId: string;
}

const ShareSongModal: React.FC<ShareSongProps> = ({ title, songId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setShareLink(`localhost:3000/play/${songId}`);
  }, [songId]);

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
    // setTimeout(() => setCopied(false), 1500);
    closeWithAnimation();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4 text-foreground"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeWithAnimation();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug line-clamp-2">
            Share <span className="font-bold">{title}</span>
          </h3>
          <button
            onClick={closeWithAnimation}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1 min-w-0 rounded-md bg-muted px-3 py-2 text-sm border border-border text-muted-foreground truncate"
          />
          <Button
            onClick={handleCopy}
            variant={copied ? "secondary" : "default"}
            className="shrink-0 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareSongModal;
