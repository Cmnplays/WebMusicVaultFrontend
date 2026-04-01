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
        flex items-center gap-0 cursor-default select-none
        focus:outline-none border-b border-[#d4d0c8] last:border-b-0
        ${isCurrentSongPlaying
          ? "bg-[#0a246a] text-white"
          : "bg-white text-black hover:bg-[#c7d4ea] hover:text-black"
        }
      `}
      style={{ fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif" }}
    >
      {/* Row number / icon cell */}
      <div className={`w-8 flex items-center justify-center py-1 flex-shrink-0 border-r ${isCurrentSongPlaying ? "border-[#3a5aa0]" : "border-[#d4d0c8]"}`}>
        {isCurrentSongPlaying ? (
          /* Playing equalizer bars */
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="6" width="3" height="10" fill="currentColor"/>
            <rect x="6" y="2" width="3" height="14" fill="currentColor"/>
            <rect x="11" y="4" width="3" height="12" fill="currentColor"/>
          </svg>
        ) : (
          <svg className="w-3 h-3 text-[#808080]" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2v8.27A3 3 0 1 0 8 13V5h3V2H6z"/>
          </svg>
        )}
      </div>

      {/* Title cell */}
      <div className={`flex-1 min-w-0 py-1 px-2 border-r ${isCurrentSongPlaying ? "border-[#3a5aa0]" : "border-[#d4d0c8]"}`}>
        <span
          className={`text-[12px] truncate block leading-tight font-sans ${isCurrentSongPlaying ? "font-bold" : ""}`}
          title={song.title}
        >
          {song.title.split(".")[0]}
        </span>
      </div>

      {/* Artist cell */}
      <div className={`w-32 hidden sm:block py-1 px-2 border-r ${isCurrentSongPlaying ? "border-[#3a5aa0]" : "border-[#d4d0c8]"}`}>
        <span className="text-[11px] truncate block">
          {song.artist || "Unknown"}
        </span>
      </div>

      {/* Duration cell */}
      <div className="w-14 text-right py-1 px-2 flex-shrink-0">
        <span className="text-[11px] font-mono tabular-nums">
          {formatDuration(song.duration)}
        </span>
      </div>
    </li>
  );
};

export default SongCard;
