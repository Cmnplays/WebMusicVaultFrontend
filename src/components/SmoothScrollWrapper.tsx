import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
const SmoothScrollWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 450) return;
    const lenis = new Lenis({
      autoRaf: true,
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollWrapper;
