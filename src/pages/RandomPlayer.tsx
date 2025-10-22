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
import { useHandleSliderChange } from "../components/useHanldeSliderChange";
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

  const { handlePlayClick } = useAudioPlayer({
    panelRef,
    audioRef,
    songs: previousSongs,
  });
  useEffect(() => {
    const returnRandSong = async () => {
      const randomSong = await getRandomSong();
      dispatch(setPlayingSong(randomSong));
      handlePlayClick(randomSong);
      setPreviousSongs((prev) => [...prev, randomSong]);
    };
    returnRandSong();
  }, [dispatch, triggerNext]);
  useEffect(() => {
    //write code for focusing on input upon opening this page
    return () => {
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
    };
  }, [dispatch]);
  const moveToNextSong = () => {
    const posOfCurrentSong = previousSongs.findIndex(
      (song) => song._id === playingSong!._id
    );
    const nextSong = previousSongs[posOfCurrentSong + 1];
    if (!nextSong) {
      setTriggerNext(!triggerNext);
      return;
    }
    dispatch(setPlayingSong(nextSong));
  };
  const moveToPreviousSong = () => {
    const posOfCurrentSong = previousSongs.findIndex(
      (song) => song._id === playingSong!._id
    );
    const prevSong = previousSongs[posOfCurrentSong - 1];
    if (!prevSong) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    dispatch(setPlayingSong(prevSong));
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 text-white flex flex-col justify-center items-center p-4">
      <audio
        ref={audioRef}
        onEnded={moveToNextSong}
        preload="metadata"
        hidden
      />

      {playingSong && (
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          {/* Song Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center truncate w-full px-2">
            {playingSong.title}
          </h1>

          {/* Recently Played */}
          {previousSongs.length > 1 && (
            <div className="w-full flex gap-3 overflow-x-auto py-2 px-1">
              {previousSongs
                .slice(-3, -1) // last 2 songs before current
                .map((song) => (
                  <button
                    key={song._id}
                    onClick={() => {
                      dispatch(setPlayingSong(song));
                      handlePlayClick(song);
                    }}
                    className="flex-none bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded-full shadow-md truncate text-xs sm:text-sm transition-colors duration-300"
                  >
                    {song.title}
                  </button>
                ))}
            </div>
          )}

          {/* Progress Slider */}
          <div className="w-full flex flex-col items-center">
            <input
              type="range"
              min={0}
              max={Math.floor(duration)}
              value={Math.floor(currentTime)}
              onChange={handleSliderChange}
              className="w-full h-2 bg-purple-600 rounded-full appearance-none cursor-pointer accent-orange-400 hover:accent-orange-500 transition-colors duration-300"
            />
            <div className="flex justify-between w-full text-xs font-mono text-purple-300 mt-1 px-1">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration - currentTime)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {/* Previous */}
            <button
              onClick={moveToPreviousSong}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-600 shadow-md hover:shadow-lg active:scale-95 transition-transform"
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
                  return;
                }
                audioRef.current?.pause();
                dispatch(setPlaying(false));
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
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
              className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-600 shadow-md hover:shadow-lg active:scale-95 transition-transform"
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
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between w-full mt-6 px-4">
            <button
              onClick={() => {
                dispatch(setPlaying(false));
                audioRef.current?.pause();
                dispatch(setMountDeleteConfirmation(true));
              }}
              className="text-white hover:text-orange-400 transition-colors"
            >
              <i className="ri-delete-bin-line text-2xl" />
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`text-white hover:text-orange-400 transition-colors ${
                downloading ? "text-gray-400" : ""
              }`}
            >
              <i className="ri-download-line text-2xl" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default RandomPlayer;
