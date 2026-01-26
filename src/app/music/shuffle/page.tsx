"use client";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { getRandomSong, type Song } from "@/services/song.services";
import {
  setMountDownloadConfirmation,
  setPanelOpen,
  setLoading,
} from "@/reduxSlices/song/songSlice";
import { formatDuration } from "@/components/MusicPageComponents/formatDuration";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import DownloadConfirmation from "@/components/DownloadConfirmation";
import {
  setMountDeleteConfirmation,
  setPlaying,
  setPlayingSong,
} from "@/reduxSlices/song/songSlice";
import { useHandleSliderChange } from "@/components/useHandleSliderChange";
import Marquee from "react-fast-marquee";

const ShufflePlayer = () => {
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
  const handleSliderChange = useHandleSliderChange(audioRef);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const loading = useAppSelector((state) => state.song.loading);
  const deleting = useAppSelector((state) => state.song.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.song.mountDeleteConfirmation,
  );
  const mountDownloadConfirmation = useAppSelector(
    (state) => state.song.mountDownloadConfirmation,
  );

  useEffect(() => {
    const returnRandSong = async () => {
      dispatch(setLoading(true));
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
        dispatch(setLoading(false));
      }
    };
    returnRandSong();
  }, [dispatch, triggerNext]);

  useEffect(() => {
    return () => {
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  useEffect(() => {
    const elem = listRef.current;
    if (elem) elem.scrollTop = elem.scrollHeight;
  }, [previousSongs]);

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
    customFns: { next: moveToNextSong, previous: moveToPreviousSong },
  });

  function excludeSongFn(songId: string) {
    setPreviousSongs((prev) => prev.filter((song) => song._id !== songId));
    moveToNextSong();
  }

  return (
    <div className="h-[100vh] text-white flex flex-col items-center p-2 lg:flex-row lg:items-start lg:gap-6">
      {/* Recently Played Panel */}
      <section className="w-full lg:min-w-1/2 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl mb-6 mt-4 h-[60vh] flex flex-col md:h-[80vh] md:p-6 md:rounded-[2rem]">
        <h2 className="text-xl font-bold text-center mb-4 md:text-2xl">
          Recently Played
        </h2>

        <div
          className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-thumb-rounded-full scrollbar-track-white/10 hover:scrollbar-thumb-white/50"
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
                  className={`flex items-center gap-2 px-2 py-3 md:py-[14px] rounded-lg shadow cursor-pointer
                  backdrop-blur-lg border border-white/20
                  transition-all duration-300 hover:-translate-y-[1px]
                  focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40
                  hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]
                  hover:border-white/30 active:scale-[0.99]
                  ${
                    playingSong?._id === song._id
                      ? "bg-orange-500 text-white hover:shadow-lg md:px-4 md:py-4 md:gap-4"
                      : "bg-gradient-to-br from-white/10 to-white/5 hover:shadow-md md:px-4 md:py-4 md:gap-4"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full font-mono text-sm font-bold flex items-center justify-center select-none
                    ${
                      playingSong?._id === song._id
                        ? "bg-white text-orange-600 md:w-8 md:h-8 md:text-base"
                        : "bg-white/20 text-white md:w-8 md:h-8 md:text-base"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-grow overflow-hidden">
                    <h3
                      className={`text-lg font-semibold truncate ${
                        playingSong?._id === song._id
                          ? "text-white"
                          : "text-white/90"
                      } md:text-xl`}
                      title={song.title}
                    >
                      {song.title}
                    </h3>
                  </div>
                </li>
              ))
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center px-3">
              <p className="text-orange-400 text-2xl sm:text-3xl font-bold mb-2 animate-bounce md:text-4xl">
                🎵 The stage is empty…
              </p>
              <p className="text-purple-100 text-base sm:text-lg md:text-lg">
                …but you’re the star! Start playing songs to fill this space
                with music.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Music Player */}
      {playingSong && (
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
      )}

      {mountDeleteConfirmation && (
        <DeleteConfirmation
          title={playingSong!.title}
          songId={playingSong!._id}
          moveToNextSong={moveToNextSong}
          temp={true}
          customExcludeFn={excludeSongFn}
        />
      )}

      {mountDownloadConfirmation && (
        <DownloadConfirmation title={playingSong!.title} />
      )}

      {(loading || deleting || downloading) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={moveToNextSong}
        preload="metadata"
        hidden
      />
    </div>
  );
};

export default ShufflePlayer;
