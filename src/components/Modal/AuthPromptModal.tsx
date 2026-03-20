"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useAppDispatch } from "@/store/hook";
import { setMountAuthPromptModal } from "@/reduxSlices/ui/uiSlice";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

interface AuthPromptModalProps {
  onClose?: () => void;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
    );
  }, []);

  function handleClose() {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      duration: 0.3,
      opacity: 0,
      scale: 0.95,
      ease: "power2.in",
      onComplete: () => {
        dispatch(setMountAuthPromptModal(false));
        if (onClose) onClose();
      },
    });
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-110  flex items-center justify-center bg-background/80 backdrop-blur-md px-5 text-foreground"
      style={{ transformOrigin: "center" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-5 sm:p-6 shadow-xl flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-red-500" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
            Like what you hear?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in or create an account to like songs and build your favourites
            collection.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full mt-1">
          <Button asChild className="w-full">
            <Link href="/login" onClick={handleClose}>
              Sign in
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/signup" onClick={handleClose}>
              Create account
            </Link>
          </Button>
        </div>

        <button
          onClick={handleClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default AuthPromptModal;
