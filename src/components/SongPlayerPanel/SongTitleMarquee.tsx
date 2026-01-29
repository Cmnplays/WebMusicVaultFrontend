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
          px-2 font-semibold truncate
          text-center text-lg
          h-[40px] flex items-center justify-center
          lg:text-xl lg:h-[42px]
        "
    >
      <Marquee
        key={playingSong._id}
        speed={50}
        delay={1}
        pauseOnHover
        className="overflow-hidden"
      >
        <span className="mx-5">
          <span className="text-xl mr-2 text-purple-200">⬤</span>
          {playingSong.title}
        </span>
      </Marquee>
    </div>
  );
};

export default SongTitleMarquee;
