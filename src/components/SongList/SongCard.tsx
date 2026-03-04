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
                  shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow
                  ${
                    isCurrentSongPlaying
                      ? "bg-linear-to-tr from-orange-400 to-purple-600"
                      : "bg-linear-to-tr from-purple-500 to-purple-700"
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
      <div className="grow overflow-hidden">
        <h3
          className="text-lg font-semibold text-white truncate"
          title={song.title}
        >
          {song.title.split(".")[0]}
        </h3>
        <p className="text-xs truncate mt-0.5 text-white/40 font-light tracking-wide">
          {song.artist}
        </p>
      </div>

      {/* Duration */}
      <div className="shrink-0 bg-purple-900/40 text-purple-200 text-xs font-mono font-semibold px-2 py-0.5 rounded-full select-none border border-white/10">
        {formatDuration(song.duration)}
      </div>
    </li>
  );
};

export default SongCard;
