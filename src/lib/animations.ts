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
