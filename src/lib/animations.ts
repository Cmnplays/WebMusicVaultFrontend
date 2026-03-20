import gsap from "gsap";

export const fadeOutPanel = (
  panelElement: HTMLDivElement,
  onComplete?: () => void,
) => {
  if (typeof window === "undefined") return;
  gsap.to(panelElement, {
    y: "100%",
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete,
  });
};

export const fadeInPanel = (panelElement: HTMLDivElement) => {
  gsap.fromTo(
    panelElement,
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" },
  );
};

export const fadeInExpandedPanel = (panelElement: HTMLDivElement) => {
  if (typeof window === "undefined") return;
  gsap.fromTo(
    panelElement,
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 0.45, ease: "power3.out" },
  );
};

export const fadeOutExpandedPanel = (
  panelElement: HTMLDivElement,
  onComplete?: () => void,
) => {
  if (typeof window === "undefined") return;
  gsap.to(panelElement, {
    y: "100%",
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete,
  });
};

export const fadeInMiniPlayer = (panelElement: HTMLDivElement) => {
  if (typeof window === "undefined") return;
  gsap.fromTo(
    panelElement,
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 0.35, ease: "power3.out" },
  );
};

export const fadeOutMiniPlayer = (
  panelElement: HTMLDivElement,
  onComplete?: () => void,
) => {
  if (typeof window === "undefined") return;
  gsap.to(panelElement, {
    y: "100%",
    opacity: 0,
    duration: 0.3,
    ease: "power3.in",
    onComplete,
  });
};
