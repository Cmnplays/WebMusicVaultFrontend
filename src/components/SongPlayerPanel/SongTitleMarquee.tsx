import React, { useEffect, useRef, useState } from "react";
import type { Song } from "@/services/song.services";
import Marquee from "react-fast-marquee";
interface SongTitleMarqueeProps {
  playingSong: Song;
}
const SongTitleMarquee: React.FC<SongTitleMarqueeProps> = ({ playingSong }) => {
  const title = playingSong.title.replace(/\.mp3$/i, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  // Only animate the marquee when the title actually overflows — otherwise it's an infinite GPU loop doing nothing
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const span = el.querySelector("[data-title-text]") as HTMLSpanElement | null;
      if (!span) return;
      // container width minus the bullet's ~24px
      setOverflows(span.scrollWidth > el.clientWidth - 28);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [title]);

  return (
    <div
      ref={containerRef}
      className="
  px-2 font-semibold
  text-center text-lg
  h-[58px] flex flex-col items-center justify-center
  lg:text-xl lg:h-[62px]
"
    >
      {overflows ? (
        <Marquee
          key={playingSong._id}
          speed={50}
          delay={1}
          pauseOnHover
          className="overflow-hidden w-full"
        >
          <span className="mx-5" data-title-text>
            <span className="text-xl mr-2 text-purple-200">⬤</span>
            {title}
          </span>
        </Marquee>
      ) : (
        <span className="block truncate w-full" data-title-text>
          <span className="text-xl mr-2 text-purple-200">⬤</span>
          {title}
        </span>
      )}
      <p className="text-[11px] text-white/70 tracking-[0.1em] leading-none mt-1 font-medium">
        ✦ {playingSong.artist} ✦
      </p>
    </div>
  );
};

export default SongTitleMarquee;
