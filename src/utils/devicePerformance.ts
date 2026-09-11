"use client";

import { useState, useEffect } from "react";

interface DeviceCapabilities {
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  hardwareConcurrency: number;
  deviceMemory: number;
}

function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      isLowEnd: false,
      prefersReducedMotion: false,
      hardwareConcurrency: 8,
      deviceMemory: 8,
    };
  }

  const hardwareConcurrency = navigator.hardwareConcurrency || 8;
  // deviceMemory is only available in Chromium browsers
  const deviceMemory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Determine if device is low-end — be conservative to avoid breaking desktop
  // Only flag as low-end if VERY weak: ≤2 CPU cores AND ≤2GB RAM AND small screen
  const isLowEnd =
    (hardwareConcurrency <= 2 && deviceMemory <= 2) ||
    (prefersReducedMotion && window.innerWidth <= 480);

  return {
    isLowEnd,
    prefersReducedMotion,
    hardwareConcurrency,
    deviceMemory,
  };
}

export function useReducedMotion(): boolean {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() =>
    getDeviceCapabilities(),
  );

  useEffect(() => {
    // Re-check on mount (handles SSR hydration)
    const todo = () => {
      setCapabilities(getDeviceCapabilities());
    };
    todo();

    // Listen for reduced motion preference changes
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setCapabilities(getDeviceCapabilities());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Return true only if user explicitly prefers reduced motion OR device is very low-end
  return capabilities.prefersReducedMotion || capabilities.isLowEnd;
}

// Utility to check if we should remove backdrop-blur (safe for all mobile)
export function useShouldReduceBlur(): boolean {
  const [shouldReduce, setShouldReduce] = useState(false);

  useEffect(() => {
    // Remove blur on mobile devices (screen width based, safe)
    const check = () => {
      const isMobile = window.innerWidth <= 768;
      const isLowEnd = (navigator.hardwareConcurrency || 8) <= 4;
      setShouldReduce(isMobile && isLowEnd);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return shouldReduce;
}
