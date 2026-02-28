import { formatDuration } from "./MusicPageComponents/formatDuration";
import { useEffect } from "react";
import gsap from "gsap";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { useHandleSliderChange } from "./useHandleSliderChange";
import {
  setPanelOpen,
  setPlaying,
  setRepeat,
  setShuffle,
  setMountDeleteConfirmation,
  setMountDownloadConfirmation,
} from "../reduxSlices/song/songSlice";
import Marquee from "react-fast-marquee";

interface SongPanelProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  fadeOutPanel: (panelElement: HTMLDivElement, onComplete?: () => void) => void;
  handlePlayPause: () => void;
  moveToNextSong: () => void;
  moveToPreviousSong: () => void;
}

const SongPlayerPanel = ({
  audioRef,
  handlePlayPause,
  moveToNextSong,
  moveToPreviousSong,
  panelRef,
  fadeOutPanel,
}: SongPanelProps) => {
  const dispatch = useAppDispatch();
  const playing = useAppSelector((state) => state.song.playing);
  const duration = useAppSelector((state) => state.song.duration);
  const currentTime = useAppSelector((state) => state.song.currentTime);
  const panelTrigger = useAppSelector((state) => state.song.panelTrigger);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const downloading = useAppSelector((state) => state.song.downloading);
  const repeat = useAppSelector((state) => state.song.repeat);
  const shuffle = useAppSelector((state) => state.song.shuffle);

  const handleSliderChange = useHandleSliderChange(audioRef);

  const fadeInPanel = (panelElement: HTMLDivElement) => {
    gsap.fromTo(
      panelElement,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" },
    );
  };

  useEffect(() => {
    if (panelRef.current) fadeInPanel(panelRef.current);
  }, [panelTrigger, panelRef]);
  return (
    playingSong && (
      <div
        ref={panelRef}
        style={{ transform: "translateY(100%)", opacity: 0 }}
        className="
        fixed bottom-0 left-0 w-full max-w-5xl mx-auto

        /* ✅ Same gradient, just softened */
        bg-gradient-to-tr from-purple-900/95 via-purple-800/95 to-purple-700/95

        /* ✅ Soft border to match new theme */
        border-t border-white/10

        rounded-t-xl 
        shadow-[0_8px_20px_rgba(0,0,0,0.25)] 
        text-white z-50

        /* Mobile */
        py-4 px-1

        /* Desktop */
        lg:py-2 lg:px-2 lg:rounded-xl
      "
      >
        {/* Top Controls */}
        <div className="flex justify-center mb-2 lg:mb-2">
          <div className="flex w-full justify-around">
            <button
              onClick={() => {
                dispatch(setPlaying(false));
                audioRef.current!.pause();
                dispatch(setMountDeleteConfirmation(true));
              }}
            >
              <i
                className="
                ri-delete-bin-line 
                text-white/90 hover:text-orange-400 
                transition-colors duration-300
                text-2xl lg:text-3xl
              "
              />
            </button>

            <i
              className="
              ri-arrow-down-wide-line 
              text-white/90 hover:text-orange-400 
              transition-colors duration-300
              text-3xl lg:text-4xl
            "
              role="button"
              aria-label="Close player panel"
              onClick={() => {
                if (panelRef.current && audioRef && !downloading) {
                  fadeOutPanel(panelRef.current, () => {
                    dispatch(setPanelOpen(false));
                    dispatch(setRepeat("repeat"));
                  });
                  audioRef.current!.pause();
                  dispatch(setPlaying(false));
                }
              }}
            />

            <button
              onClick={() => dispatch(setMountDownloadConfirmation(true))}
              aria-label="Download song"
              disabled={downloading}
            >
              <i
                className={`
                ri-download-line
                ${
                  downloading
                    ? "text-gray-400"
                    : "text-white/90 hover:text-orange-400"
                }
                transition-colors duration-300
                text-2xl lg:text-3xl
              `}
              />
            </button>
          </div>
        </div>

        <hr className="border-white/20" />

        {/* Song Title */}
        <div
          className="
  px-2 font-semibold
  text-center text-lg
  h-[58px] flex flex-col items-center justify-center
  lg:text-xl lg:h-[62px]
"
        >
          <Marquee
            key={playingSong._id}
            speed={50}
            delay={1}
            pauseOnHover
            className="overflow-hidden w-full"
          >
            <span className="mx-5">
              <span className="text-xl mr-2 text-purple-200">⬤</span>
              {playingSong.title.replace(".mp3", "")}
            </span>
          </Marquee>
          <p className="text-[11px] text-white/70 tracking-[0.1em] leading-none mt-1 font-medium">
            ✦ {playingSong.artist} ✦
          </p>
        </div>

        {/* Progress Slider */}
        <input
          type="range"
          min={0}
          max={Math.floor(duration)}
          value={Math.floor(currentTime)}
          onChange={(e) => handleSliderChange(e)}
          className="
          w-full bg-purple-600/80 rounded-full appearance-none cursor-pointer
          accent-orange-400 hover:accent-orange-500 transition-colors duration-300
          h-2 lg:h-3 mb-3
        "
        />

        {/* Controls + Time */}
        <div className="flex items-center justify-between px-2">
          <span
            className="
            font-mono text-purple-300 text-left select-none
            w-10 text-xs
            lg:w-12 lg:text-sm
          "
          >
            {formatDuration(currentTime)}
          </span>

          <div
            className="
            w-[90%] flex items-center justify-center gap-4
            lg:gap-6 lg:h-[80px]
          "
          >
            {/* Shuffle */}
            <button className="relative" onClick={() => dispatch(setShuffle())}>
              {shuffle ? (
                <i className="ri-shuffle-line text-white/90 text-2xl lg:text-3xl" />
              ) : (
                <div className="relative inline-block">
                  <i className="ri-shuffle-line text-white/40 text-2xl lg:text-3xl" />
                  <div className="absolute inset-0 m-auto w-[1.25px] lg:w-[1.5px] h-full bg-white/70 rotate-[-45deg]" />
                </div>
              )}
            </button>

            {/* Previous */}
            <button
              aria-label="Previous"
              className="
              flex items-center justify-center rounded-full
              bg-purple-700/90 hover:bg-purple-600/90 
              transition-transform shadow-md hover:shadow-lg active:scale-95
              w-10 h-10 lg:w-12 lg:h-12
            "
              onClick={moveToPreviousSong}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-purple-200 w-5 h-5 lg:w-6 lg:h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M11 5L4 12L11 19V5Z" />
                <rect x="14" y="5" width="2" height="14" rx="1" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              aria-label={playing ? "Pause" : "Play"}
              onClick={handlePlayPause}
              className="
              rounded-full bg-gradient-to-tr from-orange-400 to-purple-600
              flex items-center justify-center text-white
              shadow-lg hover:scale-110 active:scale-95 transition-transform
              w-14 h-14 lg:w-16 lg:h-16
            "
            >
              {playing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-white w-7 h-7 lg:w-9 lg:h-9"
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
                  className="stroke-white w-7 h-7 lg:w-9 lg:h-9"
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
              aria-label="Next"
              onClick={moveToNextSong}
              className="
              flex items-center justify-center rounded-full
              bg-purple-700/90 hover:bg-purple-600/90 
              transition-transform shadow-md hover:shadow-lg active:scale-95
              w-10 h-10 lg:w-12 lg:h-12
            "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-purple-200 w-5 h-5 lg:w-6 lg:h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M13 5L20 12L13 19V5Z" />
                <rect x="8" y="5" width="2" height="14" rx="1" />
              </svg>
            </button>

            {/* Repeat */}
            <button
              onClick={() => {
                if (repeat === "repeat") dispatch(setRepeat("single"));
                else if (repeat === "single") dispatch(setRepeat("noRepeat"));
                else dispatch(setRepeat("repeat"));
              }}
            >
              {repeat === "repeat" && (
                <i className="ri-repeat-2-line text-white/90 text-2xl lg:text-3xl" />
              )}
              {repeat === "single" && (
                <i className="ri-repeat-one-line text-white/90 text-2xl lg:text-3xl" />
              )}
              {repeat === "noRepeat" && (
                <div className="relative inline-block">
                  <i className="ri-repeat-2-line text-white/40 text-2xl lg:text-3xl" />
                  <div className="absolute inset-0 m-auto w-[1.25px] lg:w-[1.5px] h-full bg-white/70 rotate-[-45deg]" />
                </div>
              )}
            </button>
          </div>

          <span
            className="
            font-mono text-purple-300 text-right select-none
            w-10 text-xs lg:w-12 lg:text-sm
          "
          >
            {formatDuration(duration - currentTime)}
          </span>
        </div>
      </div>
    )
  );
};

export default SongPlayerPanel;
