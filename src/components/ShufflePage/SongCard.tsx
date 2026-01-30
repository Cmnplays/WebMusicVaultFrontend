import { Song } from "@/services/song.services";
import React from "react";
interface SongCardProps {
  itemRefs: React.RefObject<Record<string, HTMLLIElement | null>>;
  song: Song;
  handlePlayClick: (song: Song) => void;
  playingSong: Song;
  index: number;
}
export const SongCard: React.FC<SongCardProps> = ({
  itemRefs,
  song,
  handlePlayClick,
  index,
  playingSong,
}) => {
  return (
    <li
      ref={(el) => {
        itemRefs.current[song._id] = el;
      }}
      key={song._id}
      onClick={() => handlePlayClick(song)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePlayClick(song);
        }
      }}
      className={`flex items-center gap-2 px-2 py-3 md:py-[14px] rounded-lg shadow cursor-pointer
                  backdrop-blur-lg border border-white/20
                  transition-all duration-300 hover:-translate-y-[1px]
                  focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40
                  hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]
                  hover:border-white/30 active:scale-[0.99]
                  ${
                    playingSong?._id === song._id
                      ? "bg-orange-500 text-white hover:shadow-lg md:px-4 md:py-4 md:gap-4"
                      : "bg-gradient-to-br from-white/10 to-white/5 hover:shadow-md md:px-4 md:py-4 md:gap-4"
                  }`}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full font-mono text-sm font-bold flex items-center justify-center select-none
                    ${
                      playingSong?._id === song._id
                        ? "bg-white text-orange-600 md:w-8 md:h-8 md:text-base"
                        : "bg-white/20 text-white md:w-8 md:h-8 md:text-base"
                    }`}
      >
        {index + 1}
      </div>

      <div className="flex-grow overflow-hidden">
        <h3
          className={`text-lg font-semibold truncate ${
            playingSong?._id === song._id ? "text-white" : "text-white/90"
          } md:text-xl`}
          title={song.title}
        >
          {song.title}
        </h3>
      </div>
    </li>
  );
};
