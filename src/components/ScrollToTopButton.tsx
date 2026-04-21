"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import gsap from "gsap";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        display: "flex",
      });
    } else {
      gsap.to(buttonRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (buttonRef.current) buttonRef.current.style.display = "none";
        },
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-purple-600/20 backdrop-blur-md border border-purple-500/30 text-purple-300 shadow-2xl hover:bg-purple-600/40 hover:text-white hover:border-purple-500/60 transition-all active:scale-95 group hidden items-center justify-center"
    >
      <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
    </button>
  );
};

export default ScrollToTopButton;
