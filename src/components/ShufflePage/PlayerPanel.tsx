import type { Song } from "@/services/song.services";
import React from "react";
import Marquee from "react-fast-marquee";
import { formatDuration } from "../formatDuration";
import { useAppDispatch } from "@/store/hook";
import { setPlaying } from "@/reduxSlices/player/playerSlice";
import {
  setMountDeleteConfirmation,
  setMountDownloadConfirmation,
} from "@/reduxSlices/ui/uiSlice";

interface ShufflePlayerProps {
  playingSong: Song | null;
  duration: number;
  currentTime: number;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  moveToPreviousSong: () => void;
  moveToNextSong: () => void;
  playing: boolean;
  loading: boolean;
  downloading: boolean;
  audioRef: AudioRef;
}
const SongPlayerPanel: React.FC<ShufflePlayerProps> = ({
  playingSong,
  duration,
  currentTime,
  handleSliderChange,
  moveToPreviousSong,
  playing,
  moveToNextSong,
  loading,
  downloading,
  audioRef,
}) => {
  const dispatch = useAppDispatch();

  return (
    playingSong && (
      <section className="md:min-w-[410px] w-full bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl flex flex-col items-center gap-6 mt-0 md:mt-4 md:gap-8">
        {/* Song Title */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center w-full px-2">
          <Marquee
            key={playingSong._id}
            speed={50}
            delay={1}
            pauseOnHover
            className="overflow-hidden"
          >
            <span className="mx-5">{playingSong.title}</span>
          </Marquee>
        </div>

        {/* Progress Slider */}
        <div className="w-full flex flex-col items-center">
          <input
            type="range"
            min={0}
            max={Math.floor(duration)}
            value={Math.floor(currentTime)}
            onChange={handleSliderChange}
            className="w-full h-2 bg-purple-600 rounded-full appearance-none cursor-pointer accent-orange-400 hover:accent-orange-500 transition-colors duration-300 md:h-3"
            aria-label="Playback progress"
          />
          <div className="flex justify-between w-full text-xs font-mono text-purple-300 mt-1 px-1 md:text-sm">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration - currentTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-4 md:gap-8">
          <button
            onClick={() => {
              dispatch(setPlaying(false));
              audioRef.current?.pause();
              dispatch(setMountDeleteConfirmation(true));
            }}
            className="text-white hover:text-orange-400 transition-colors text-3xl"
          >
            <i className="ri-delete-bin-line" />
          </button>

          <button
            onClick={moveToPreviousSong}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-700 hover:bg-purple-600 shadow-md hover:shadow-lg active:scale-95 transition-transform md:w-14 md:h-14"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 stroke-purple-300 md:w-7 md:h-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M11 5L4 12L11 19V5Z" />
              <rect x="14" y="5" width="2" height="14" rx="1" />
            </svg>
          </button>

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
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform md:w-20 md:h-20"
          >
            {playing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 stroke-white md:w-10 md:h-10"
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
                className="w-8 h-8 stroke-white md:w-10 md:h-10"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>

          <button
            onClick={moveToNextSong}
            disabled={loading}
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-transform ${
              loading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-purple-700 hover:bg-purple-600 hover:shadow-lg active:scale-95"
            } md:w-14 md:h-14`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 stroke-purple-300 md:w-7 md:h-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M13 5L20 12L13 19V5Z" />
              <rect x="8" y="5" width="2" height="14" rx="1" />
            </svg>
          </button>

          <button
            onClick={() => {
              dispatch(setPlaying(false));
              audioRef.current?.pause();
              dispatch(setMountDownloadConfirmation(true));
            }}
            disabled={downloading}
            className={`text-white transition-colors ${
              downloading ? "text-gray-400" : "hover:text-orange-400"
            } text-3xl`}
          >
            <i className="ri-download-line" />
          </button>
        </div>
      </section>
    )
  );
};

export default SongPlayerPanel;
