import { useRef } from "react";
import type { Song } from "../services/song.services";
import { formatDuration } from "./MusicPageComponents/formatDuration";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const SongList = ({
  songs,
  handlePlayClick,
  playingSong,
  playing,
  isTemp = false,
}: {
  songs: Song[];
  handlePlayClick: (song: Song) => void;
  playingSong: Song | null;
  playing: boolean;
  isTemp?: boolean;
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useInfiniteScroll({ isTemp, sentinelRef });

  return (
    <div>
      <ul className="space-y-4">
        {songs.map((song) => {
          const isCurrentSongPlaying = playingSong?._id === song._id && playing;

          return (
            <li
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
              aria-label={isCurrentSongPlaying ? "Pause" : "Play"}
              title={song.title.replace(".mp3", "")}
              className={`
                relative overflow-hidden
                flex items-center gap-4 p-3 rounded-xl shadow
                cursor-pointer select-none
                transition-all duration-300 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500

                before:content-[''] before:absolute before:inset-0 before:rounded-xl
                before:opacity-0 before:transition-all before:duration-300
                before:pointer-events-none
                hover:before:opacity-100

                ${
                  isCurrentSongPlaying
                    ? "bg-purple-700/60 backdrop-blur-md before:shadow-[inset_0_0_14px_rgba(255,255,255,0.45)]"
                    : "bg-white/10 backdrop-blur-md border border-white/10 before:shadow-[inset_0_0_14px_rgba(128,0,255,0.25)] hover:bg-white/20"
                }
              `}
            >
              {/* Play / Pause Icon */}
              <div
                className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow
                  ${
                    isCurrentSongPlaying
                      ? "bg-gradient-to-tr from-orange-400 to-purple-600"
                      : "bg-gradient-to-tr from-purple-500 to-purple-700"
                  }
                `}
              >
                {isCurrentSongPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                  </svg>
                )}
              </div>

              {/* Title */}
              <div className="flex-grow overflow-hidden">
                <h3
                  className="text-lg font-semibold text-white truncate"
                  title={song.title.replace(".mp3", "")}
                >
                  {song.title}
                </h3>
              </div>

              {/* Duration */}
              <div className="flex-shrink-0 bg-purple-900/40 text-purple-200 text-xs font-mono font-semibold px-2 py-0.5 rounded-full select-none border border-white/10">
                {formatDuration(song.duration)}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-[1px] w-full bg-transparent"></div>
    </div>
  );
};

export default SongList;
