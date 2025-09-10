import { useRef, useState } from "react";
import { searchSong } from "../services/song.services";
import type { Song } from "../services/song.services";
const SearchSongs = () => {
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
  const timerRef = useRef<number | null>(null);
  const debounceSearch = (query: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(async () => {
      if (!query || query == "") {
        setSearchedSongs([]);
        return;
      }

      const songs = await searchSong(query);
      setSearchedSongs(songs);
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-center">
        <input
          onChange={(e) => {
            debounceSearch(e.target.value);
          }}
          className="w-full p-3 border-2 rounded-lg"
          type="text"
          placeholder="Write Song Title here!"
        />
      </div>
      <div>
        <h2 className="text-2xl mb-2 font-bold text-gray-900 tracking-tight leading-tight my-2"></h2>

        <ul className="space-y-4">
          {searchedSongs.map((song) => {
            return (
              <li
                key={song._id}
                role="button"
                tabIndex={0}
                className="flex items-center gap-4 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow focus:outline-none
                          bg-gradient-to-tr from-blue-400 to-purple-600
                        `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                  </svg>
                </div>

                <div className="flex-grow overflow-hidden">
                  <h3
                    className="text-lg font-semibold text-gray-900 truncate"
                    title={song.title}
                  >
                    {song.title}
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SearchSongs;
