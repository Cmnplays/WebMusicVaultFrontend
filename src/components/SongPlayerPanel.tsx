import { formatDuration } from "./formatDuration";
import { useEffect } from "react";
import gsap from "gsap";
import { useAppSelector } from "../store/hook";
import { useAppDispatch } from "../store/hook";
import {
  setCurrentTime,
  setPanelOpen,
  setPlaying,
  setRepeat,
  setShuffle,
  setDownloading,
  setMountDeleteConfirmation,
} from "../reduxSlices/song/songSlice";

interface songPanelProps {
  audioRef: React.RefObject<HTMLAudioElement>;
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
}: songPanelProps) => {
  const dispatch = useAppDispatch();
  const playing = useAppSelector((state) => state.song.playing);
  const duration = useAppSelector((state) => state.song.duration);
  const currentTime = useAppSelector((state) => state.song.currentTime);
  const panelTrigger = useAppSelector((state) => state.song.panelTrigger);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const downloading = useAppSelector((state) => state.song.downloading);
  const repeat = useAppSelector((state) => state.song.repeat);
  const shuffle = useAppSelector((state) => state.song.shuffle);
  const song = useAppSelector((state) => state.song.playingSong);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    dispatch(setCurrentTime(value));
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };
  const fadeInPanel = (panelElement: HTMLDivElement) => {
    gsap.fromTo(
      panelElement,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  };
  const handleDownload = async () => {
    dispatch(setDownloading(true));
    try {
      const res = await fetch(playingSong!.fileUrl!);
      if (!res.ok) throw new Error("Failed to fetch");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = playingSong!.title!;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
    dispatch(setDownloading(false));
  };

  useEffect(() => {
    if (panelRef.current) {
      fadeInPanel(panelRef.current);
    }
  }, [panelTrigger, panelRef]);

  return (
    song && (
      <div
        ref={panelRef}
        style={{ transform: "translateY(100%)", opacity: 0 }}
        className="fixed bottom-0 left-0 w-full max-w-3xl mx-auto py-4 px-1 bg-gradient-to-tr from-purple-900 via-purple-800 to-purple-700 rounded-t-xl shadow-2xl text-white
  sm:rounded-xl sm:mx-auto sm:static sm:max-w-4xl
  flex flex-col sm:flex-row sm:items-center sm:justify-between
  space-y-3 sm:space-y-0
  "
      >
        <div className="flex justify-center mb-2">
          <div className="flex w-full justify-around ">
            <button
              onClick={() => {
                dispatch(setPlaying(false));
                audioRef.current.pause();
                dispatch(setMountDeleteConfirmation(true));
              }}
            >
              <i
                className="ri-delete-bin-line text-white text-2xl cursor-pointer hover:text-orange-400 transition-colors duration-300"
                aria-label="Delete song"
              />
            </button>
            <i
              className="ri-arrow-down-wide-line text-white text-3xl cursor-pointer hover:text-orange-400 transition-colors duration-300"
              aria-label="Close player panel"
              role="button"
              onClick={() => {
                if (panelRef.current && audioRef && !downloading) {
                  fadeOutPanel(panelRef.current, () => {
                    dispatch(setPanelOpen(false));
                    dispatch(setRepeat("repeat"));
                  });
                  audioRef.current.pause();
                  dispatch(setPlaying(false));
                }
              }}
            />
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
          {song.title}
        </div>
        <input
          type="range"
          min={0}
          max={Math.floor(duration)}
          value={Math.floor(currentTime)}
          onChange={handleSliderChange}
          className="w-full sm:w-64 h-2 bg-purple-600 rounded-full appearance-none cursor-pointer
      accent-orange-400
      hover:accent-orange-500
      transition-colors duration-300"
        />

        <div className="flex items-center justify-between sm:justify-between px-2">
          <span className="text-xs sm:text-sm font-mono text-purple-300 w-10 text-left select-none">
            {formatDuration(currentTime)}
          </span>

          <div className="w-[90%] flex items-center justify-center gap-4">
            {/* shuffle button */}
            <button className="relative" onClick={() => dispatch(setShuffle())}>
              {/* to add icon here and also to handle icon  change on being clicked */}
              {shuffle ? (
                <i className="ri-shuffle-line text-2xl text-white"></i>
              ) : (
                <div className="relative inline-block">
                  <i className="ri-shuffle-line text-2xl text-white opacity-40" />
                  {/* Slash line overlay */}
                  <div className="absolute inset-0 m-auto w-[1.25px] h-full bg-white rotate-[-45deg] " />
                </div>
              )}
            </button>

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
            <button
              aria-label={playing ? "Pause" : "Play"}
              onClick={handlePlayPause}
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
            {/* repeat, no repeat, single button */}
            <button
              onClick={() => {
                if (repeat === "repeat") {
                  dispatch(setRepeat("single"));
                } else if (repeat === "single") {
                  dispatch(setRepeat("noRepeat"));
                } else if (repeat === "noRepeat") {
                  dispatch(setRepeat("repeat"));
                }
              }}
            >
              {/* to add icons here and also to write icon logic on being clicked */}
              {repeat === "repeat" && (
                <i
                  className={`ri-repeat-2-line
              text-2xl text-white`}
                />
              )}
              {repeat === "single" && (
                <i
                  className={`ri-repeat-one-line
              text-2xl text-white`}
                />
              )}
              {repeat === "noRepeat" && (
                <div className="relative inline-block">
                  <i className="ri-repeat-2-line text-2xl text-white opacity-40" />
                  {/* Slash line overlay */}
                  <div
                    className="absolute inset-0 m-auto w-[1.25px] h-full bg-white 
                 rotate-[-45deg]"
                  />
                </div>
              )}
            </button>
          </div>

          <span className="text-xs sm:text-sm font-mono text-purple-300 w-10 text-right select-none">
            {formatDuration(duration - currentTime)}
          </span>
        </div>
      </div>
    )
  );
};

export default SongPlayerPanel;
