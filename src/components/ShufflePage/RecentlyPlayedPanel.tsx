"use client";
import React, { RefObject } from "react";
import type { Song } from "@/services/song.services";

interface RecentlyPlayedPanelProps {
  previousSongs: Song[];
  handlePlayClick: (song: Song) => void;
  playingSong: Song | null;
  listRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<Record<string, HTMLLIElement | null>>;
}
const RecentlyPlayedPanel: React.FC<RecentlyPlayedPanelProps> = ({
  previousSongs,
  handlePlayClick,
  playingSong,
  listRef,
  itemRefs,
}) => {
  return (
    <section className="w-full lg:min-w-1/2 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl mb-6 mt-4 h-[60vh] flex flex-col md:h-[80vh] md:p-6 md:rounded-[2rem]">
      <h2 className="text-xl font-bold text-center mb-4 md:text-2xl">
        Recently Played
      </h2>

      <div
        className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-thumb-rounded-full scrollbar-track-white/10 hover:scrollbar-thumb-white/50"
        ref={listRef}
      >
        {previousSongs.slice(0, previousSongs.length - 1).length > 0 ? (
          previousSongs
            .slice(0, previousSongs.length - 1)
            .map((song, index) => (
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
                      playingSong?._id === song._id
                        ? "text-white"
                        : "text-white/90"
                    } md:text-xl`}
                    title={song.title}
                  >
                    {song.title}
                  </h3>
                </div>
              </li>
            ))
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-3">
            <p className="text-orange-400 text-2xl sm:text-3xl font-bold mb-2 animate-bounce md:text-4xl">
              🎵 The stage is empty…
            </p>
            <p className="text-purple-100 text-base sm:text-lg md:text-lg">
              …but you’re the star! Start playing songs to fill this space with
              music.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyPlayedPanel;
