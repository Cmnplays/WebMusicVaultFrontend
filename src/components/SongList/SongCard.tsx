import type { Song } from "@/services/song.services";
import { formatDuration } from "../formatDuration";

interface SongCardProps {
  song: Song;
  handlePlayClick: (song: Song) => void;
  isCurrentSongPlaying: boolean;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  handlePlayClick,
  isCurrentSongPlaying,
}) => {
  return (
    <li
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
      title={isCurrentSongPlaying ? "Pause" : "Play"}
      className={`
        flex items-center gap-3 p-3 rounded-xl
        cursor-pointer select-none
        border transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
        ${
          isCurrentSongPlaying
            ? "bg-purple-700/60 border-purple-400/30 shadow-[inset_0_0_14px_rgba(255,255,255,0.1)]"
            : "bg-white/10 border-white/10 hover:bg-white/15 active:bg-white/20"
        }
      `}
    >
      {/* Play / Pause Icon */}
      <div
        className={`
          shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md
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
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
          </svg>
        )}
      </div>

      {/* Title */}
      <div className="grow overflow-hidden">
        <h3
          className="text-sm font-semibold text-white truncate leading-tight"
          title={song.title}
        >
          {song.title.replace(/\.mp3$/i, "")}
        </h3>
        <p className="text-xs truncate mt-0.5 text-white/40 font-light tracking-wide">
          {song.artist}
        </p>
      </div>

      {/* Duration */}
      <div className="shrink-0 text-purple-200/70 text-xs font-mono font-medium select-none">
        {formatDuration(song.duration)}
      </div>
    </li>
  );
};

export default SongCard;
