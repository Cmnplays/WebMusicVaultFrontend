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
import { formatDuration } from "@/components/formatDuration";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import {
  setMountDeleteConfirmation,
  setPlaying,
  setPlayingSong,
} from "@/reduxSlices/song/songSlice";
import { useHandleSliderChange } from "@/components/useHandleSliderChange";
import Marquee from "react-fast-marquee";
import SongPlayerPanel from "@/components/ShufflePage/PlayerPanel";
import RecentlyPlayedPanel from "@/components/ShufflePage/RecentlyPlayedPanel";

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
      <RecentlyPlayedPanel
        handlePlayClick={handlePlayClick}
        playingSong={playingSong}
        previousSongs={previousSongs}
        listRef={listRef}
        itemRefs={itemRefs}
      />

      <SongPlayerPanel
        audioRef={audioRef}
        currentTime={currentTime}
        duration={duration}
        downloading={downloading}
        handleSliderChange={handleSliderChange}
        moveToNextSong={moveToNextSong}
        moveToPreviousSong={moveToPreviousSong}
        loading={loading}
        playing={playing}
        playingSong={playingSong}
      />

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
