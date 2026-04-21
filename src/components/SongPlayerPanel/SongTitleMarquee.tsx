import React from "react";
import type { Song } from "@/services/song.services";
import Marquee from "react-fast-marquee";
interface SongTitleMarqueeProps {
  playingSong: Song;
}
const SongTitleMarquee: React.FC<SongTitleMarqueeProps> = ({ playingSong }) => {
  return (
    <div
      className="
  px-2 font-semibold
  text-center text-lg
  h-[58px] flex flex-col items-center justify-center
  lg:text-xl lg:h-[62px]
"
    >
      <Marquee
        key={playingSong._id}
        speed={50}
        delay={1}
        pauseOnHover
        className="overflow-hidden w-full"
      >
        <span className="mx-5">
          <span className="text-xl mr-2 text-purple-200">⬤</span>
          {playingSong.title.replace(/\.(mp3|wav|m4a|flac|ogg)$/i, "")}
        </span>
      </Marquee>
      <p className="text-[11px] text-white/70 tracking-[0.1em] leading-none mt-1 font-medium">
        ✦ {playingSong.artist} ✦
      </p>
    </div>
  );
};

export default SongTitleMarquee;
