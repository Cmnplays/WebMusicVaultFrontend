import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { getRandomSong, type Song } from "../services/song.services";
import { setPanelOpen } from "../reduxSlices/song/songSlice";
import { formatDuration } from "../components/MusicPageComponents/formatDuration";
import {
  setMountDeleteConfirmation,
  setPlaying,
  setPlayingSong,
} from "../reduxSlices/song/songSlice";
import { useHandleDownload } from "../hooks/useHandleDownload";
import { useHandleSliderChange } from "../components/useHandleSliderChange";
const RandomPlayer = () => {
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const playing = useAppSelector((state) => state.song.playing);
  const currentTime = useAppSelector((state) => state.song.currentTime);
  const duration = useAppSelector((state) => state.song.duration);
  const downloading = useAppSelector((state) => state.song.downloading);
  const [triggerNext, setTriggerNext] = useState(false);
  const [previousSongs, setPreviousSongs] = useState<Song[]>([]);
  const handleDownload = useHandleDownload();
  const handleSliderChange = useHandleSliderChange(audioRef);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [loading, setLoading] = useState(false);
  const navHeight = useAppSelector((state) => state.song.navHeight);

  
  useEffect(() => {
    const returnRandSong = async () => {
      setLoading(true);
      try {
        const randomSong = await getRandomSong();
        if (
          previousSongs.findIndex((song) => song._id == randomSong._id) !== -1
        ) {
          setTriggerNext(!triggerNext);
          return;
        }
        setPreviousSongs((prev) => [...prev, randomSong]);
        dispatch(setPlayingSong(randomSong));
        handlePlayClick(randomSong);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    returnRandSong();
  }, [dispatch, triggerNext]);

  useEffect(() => {
    return () => {
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
    };
  }, [dispatch]);
  //for auto scrolling of song list when more songs are added
  useEffect(() => {
    const elem = listRef.current;
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [previousSongs]);
  //for making the currently playing song stay at the middle
  useEffect(() => {
    if (playingSong && itemRefs.current![playingSong._id]) {
      itemRefs.current[playingSong._id]!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [playingSong]);
  const moveToNextSong = () => {
    const currentPlayingIndex = previousSongs.indexOf(playingSong!);
    const nextSong = previousSongs[currentPlayingIndex + 1];
    if (nextSong) {
      dispatch(setPlayingSong(nextSong));
      return;
    }
    setTriggerNext(!triggerNext);
  };
  const moveToPreviousSong = () => {
    const prevSong = previousSongs[previousSongs.indexOf(playingSong!) - 1];
    if (!prevSong) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    dispatch(setPlayingSong(prevSong));
  };
const { handlePlayClick } = useAudioPlayer({
    panelRef,
    audioRef,
    songs: previousSongs,
    customFns:{next:moveToNextSong,previous:moveToPreviousSong}
  });
  return (
    <div
      // style={{ height: `calc(100vh - ${navHeight})` }}
      className="h-[100vh] bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 text-white flex flex-col items-center p-4"
    >
      {/* Recently Played Panel */}
      <section className="w-full max-w-[94%] bg-purple-800 p-4 rounded-2xl shadow-xl mb-6 mt-4 h-[60vh] flex flex-col">
        <h2 className="text-xl font-bold text-center mb-4">Recently Played</h2>

        <div
          className="flex-1 flex flex-col gap-2 overflow-y-auto"
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
                  className={`flex items-center gap-2 px-2 py-3 rounded-lg shadow transition-shadow duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 ${
                    playingSong?._id === song._id
                      ? "bg-orange-500 text-white hover:shadow-lg"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  {/* Numbering */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full font-mono text-sm font-bold flex items-center justify-center select-none ${
                      playingSong?._id === song._id
                        ? "bg-white text-orange-600"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Song Title */}
                  <div className="flex-grow overflow-hidden">
                    <h3
                      className={`text-lg font-semibold truncate ${
                        playingSong?._id === song._id
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                      title={song.title}
                    >
                      {song.title}
                    </h3>
                  </div>
                </li>
              ))
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center px-3">
              <p className="text-orange-400 text-2xl sm:text-3xl font-bold mb-2 animate-bounce">
                🎵 The stage is empty…
              </p>
              <p className="text-purple-100 text-base sm:text-lg">
                …but you’re the star! Start playing songs to fill this space
                with music.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Music Player */}
      {playingSong && (
        <section
          className={`w-full max-w-sm flex flex-col items-center gap-6 mt-[${navHeight}]`}
        >
          {/* Song Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center truncate w-full px-2">
            {playingSong.title}
          </h1>

          {/* Progress Slider */}
          <div className="w-full flex flex-col items-center">
            <input
              type="range"
              min={0}
              max={Math.floor(duration)}
              value={Math.floor(currentTime)}
              onChange={handleSliderChange}
              className="w-full h-2 bg-purple-600 rounded-full appearance-none cursor-pointer accent-orange-400 hover:accent-orange-500 transition-colors duration-300"
              aria-label="Playback progress"
            />
            <div className="flex justify-between w-full text-xs font-mono text-purple-300 mt-1 px-1">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration - currentTime)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {/* Delete */}
            <button
              onClick={() => {
                dispatch(setPlaying(false));
                audioRef.current?.pause();
                dispatch(setMountDeleteConfirmation(true));
              }}
              className="text-white hover:text-orange-400 transition-colors"
              aria-label="Delete song"
            >
              <i className="ri-delete-bin-line text-2xl" />
            </button>
            {/* Previous */}
            <button
              onClick={moveToPreviousSong}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-600 shadow-md hover:shadow-lg active:scale-95 transition-transform"
              aria-label="Previous song"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-purple-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M11 5L4 12L11 19V5Z" />
                <rect x="14" y="5" width="2" height="14" rx="1" />
              </svg>
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => {
                if (!playing) {
                  audioRef.current?.play();
                  dispatch(setPlaying(true));
                } else {
                  audioRef.current?.pause();
                  dispatch(setPlaying(false));
                }
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 stroke-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 stroke-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={moveToNextSong}
              disabled={loading}
              className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-transform
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed opacity-50"
      : "bg-purple-700 hover:bg-purple-600 hover:shadow-lg active:scale-95"
  }
`}
              aria-label="Next song"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-purple-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M13 5L20 12L13 19V5Z" />
                <rect x="8" y="5" width="2" height="14" rx="1" />
              </svg>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`text-white transition-colors ${
                downloading ? "text-gray-400" : "hover:text-orange-400"
              }`}
              aria-label="Download song"
            >
              <i className="ri-download-line text-2xl" />
            </button>
          </div>
        </section>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={moveToNextSong}
        preload="metadata"
        hidden
      />
    </div>
  );
};

export default RandomPlayer;
