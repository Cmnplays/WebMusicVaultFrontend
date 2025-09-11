import type { Song } from "../../services/song.services";
import { formatDuration } from "../MusicPageComponents/formatDuration";
const SongList = ({
  songs,
  handlePlayClick,
  playingSong,
  playing,
}: {
  songs: Song[];
  handlePlayClick: (song: Song) => void;
  playingSong: Song | null;
  playing: boolean;
}) => {
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
              title={isCurrentSongPlaying ? "Pause" : "Play"}
              className="flex items-center gap-4 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow focus:outline-none
                    ${
                      isCurrentSongPlaying
                        ? "bg-gradient-to-tr from-purple-700 to-purple-900"
                        : "bg-gradient-to-tr from-blue-400 to-purple-600"
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

              <div className="flex-grow overflow-hidden">
                <h3
                  className="text-lg font-semibold text-gray-900 truncate"
                  title={song.title}
                >
                  {song.title}
                </h3>
              </div>

              <div className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-mono font-semibold px-2 py-0.5 rounded-full select-none">
                {formatDuration(song.duration)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SongList;
