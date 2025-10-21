import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { setPlaying, setPlayingSong } from "../reduxSlices/song/songSlice";
import { getRandomSong } from "../services/song.services";
import { setPanelOpen } from "../reduxSlices/song/songSlice";
import { formatDuration } from "../components/MusicPageComponents/formatDuration";
import { setMountDeleteConfirmation } from "../reduxSlices/song/songSlice";
import { useHandleDownload } from "../hooks/useHandleDownload";
import { useHandleSliderChange } from "../components/useHanldeSliderChange";
import type { Song } from "../services/song.services";
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
    setTriggerNext(!triggerNext);
  };
  const moveToPreviousSong = () => {
    const posOfCurrentSong = previousSongs.findIndex(
      (song) => song._id === playingSong!._id
    );
    const prevSong = previousSongs[posOfCurrentSong - 1];
    if (!prevSong) {
      dispatch(setPlayingSong(playingSong));
      return;
    }
    dispatch(setPlayingSong(previousSongs[posOfCurrentSong - 1]));
  };

  return (
    <>
      {playingSong && audioRef && (
        <div>
          <audio
            ref={audioRef}
            onEnded={moveToNextSong}
            preload="metadata"
            hidden
          />

          <div className="flex justify-center mb-2">
            <div className="flex w-full justify-around ">
              <button
                onClick={() => {
                  dispatch(setPlaying(false));
                  audioRef.current!.pause();
                  dispatch(setMountDeleteConfirmation(true));
                }}
              >
                <i
                  className="ri-delete-bin-line text-white text-2xl cursor-pointer hover:text-orange-400 transition-colors duration-300"
                  aria-label="Delete song"
                />
              </button>
              <button
                onClick={handleDownload}
                aria-label="Download song"
                className="relative"
                disabled={downloading}
              >
                <i
                  className={`ri-download-line ${
                    downloading && "text-gray-400"
                  } text-2xl cursor-pointer hover:text-orange-400 transition-colors duration-300`}
                />
              </button>
            </div>
          </div>
          <hr />
          <div className="text-center sm:text-left text-lg sm:text-base font-semibold truncate px-2">
            {playingSong.title}
          </div>
          <input
            type="range"
            min={0}
            max={Math.floor(duration)}
            value={Math.floor(currentTime)}
            onChange={(e) => handleSliderChange(e)}
            className="w-full sm:w-64 h-2 bg-purple-600 rounded-full appearance-none cursor-pointer
           accent-orange-400
           hover:accent-orange-500
           transition-colors duration-300"
          />

          <div className="flex items-center justify-between sm:justify-between px-2">
            {/* Duration normal */}
            <span className="text-xs sm:text-sm font-mono text-purple-300 w-10 text-left select-none">
              {formatDuration(currentTime)}
            </span>

            <div className="w-[90%] flex items-center justify-center gap-4">
              {/* Move to previous song */}

              <button
                aria-label="Previous"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-600 transition-transform shadow-md hover:shadow-lg active:scale-95"
                onClick={moveToPreviousSong}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 stroke-purple-300"
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
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => {
                  if (!playing) {
                    audioRef.current?.play();
                    dispatch(setPlaying(true));
                    return;
                  }
                  audioRef.current?.pause();
                  dispatch(setPlaying(false));
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform"
              >
                {playing ? (
                  // Pause icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                ) : (
                  // Play icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>
              {/* Move to next song */}

              <button
                aria-label="Next"
                onClick={moveToNextSong}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-600 transition-transform shadow-md hover:shadow-lg active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 stroke-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path d="M13 5L20 12L13 19V5Z" />
                  <rect x="8" y="5" width="2" height="14" rx="1" />
                </svg>
              </button>
            </div>
            {/* Duration reverse */}
            <span className="text-xs sm:text-sm font-mono text-purple-300 w-10 text-right select-none">
              {formatDuration(duration - currentTime)}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default RandomPlayer;
