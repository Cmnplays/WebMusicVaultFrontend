"use client";
import React, { useEffect } from "react";
import type { Song } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import useMediaSession from "./useMediaSession";

import { usePathname } from "next/navigation";

import {
  setPlaying,
  setRepeat,
  setPlayingSong,
  setDuration,
  setCurrentTime,
  setMiniPanelOpen,
} from "../reduxSlices/player/playerSlice";

type customFnType = {
  next: () => void;
  previous: () => void;
};
export const useAudioPlayer = ({
  audioRef,
  songs,
  customFns,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  songs: Song[];
  customFns?: customFnType;
}) => {
  const dispatch = useAppDispatch();
  const miniPanelOpen = useAppSelector((state) => state.player.miniPanelOpen);
  const playing = useAppSelector((state) => state.player.playing);
  const repeat = useAppSelector((state) => state.player.repeat);
  const shuffle = useAppSelector((state) => state.player.shuffle);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const pathname = usePathname();

  //    Play or pause audio based on playingSong and playing state
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !playingSong?.fileUrl) {
      if (audioEl) {
        audioEl.pause();
        audioEl.src = "";
      }
      return;
    }

    const isNewSource = audioEl.src !== playingSong.fileUrl;

    if (isNewSource) {
      audioEl.src = playingSong.fileUrl;
      
      // Restore saved time on first load after refresh
      if (isInitialMount.current && currentTime > 0) {
        audioEl.currentTime = currentTime;
      } else {
        audioEl.currentTime = 0;
      }
    }

    if (playing) {
      const cleanTitle = playingSong.title.replace(/\.mp3$/i, "");
      document.title = ` 🎧 ${cleanTitle} | WebMusicVault`;

      audioEl.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Audio play error", err);
          dispatch(setPlaying(false));
        }
      });
    } else {
      document.title = "WebMusicVault";
      audioEl.pause();
    }

    isInitialMount.current = false;
  }, [playingSong?.fileUrl, playing, audioRef, playingSong?.title]);

  //song time related data updatation & Hardware Button Sync
  useEffect(() => {
    const song = audioRef.current;
    if (!song) return;

    const onLoadMetadata = () => {
      dispatch(setDuration(song.duration ?? 0));
    };
    const onTimeUpdate = () => {
      dispatch(setCurrentTime(song.currentTime ?? 0));
    };

    // SYNC: Update UI if paused via hardware/lock-screen buttons
    const handleOnPlay = () => dispatch(setPlaying(true));
    const handleOnPause = () => dispatch(setPlaying(false));

    song.addEventListener("loadedmetadata", onLoadMetadata);
    song.addEventListener("timeupdate", onTimeUpdate);
    song.addEventListener("play", handleOnPlay);
    song.addEventListener("pause", handleOnPause);

    return () => {
      song.removeEventListener("loadedmetadata", onLoadMetadata);
      song.removeEventListener("timeupdate", onTimeUpdate);
      song.removeEventListener("play", handleOnPlay);
      song.removeEventListener("pause", handleOnPause);
    };
  }, [dispatch, audioRef]);

  function getNextShuffleSongIndex(): number {
    return Math.floor(Math.random() * songs.length);
  }
  // New: Handle when current song ends, play next if available
  function handleAudioEnded() {
    if (!playingSong) return;

    const currentIndex = songs.findIndex((s) => s._id === playingSong._id);
    if (currentIndex === -1) {
      dispatch(setPlayingSong(null));
      dispatch(setPlaying(false));
      return;
    }
    //All cases when shuffle is false
    if (!shuffle) {
      if (repeat === "single") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        dispatch(setPlaying(true));
        return;
      }
      if (repeat === "noRepeat") {
        dispatch(setPlayingSong(null));
        dispatch(setRepeat("repeat"));
        dispatch(setPlaying(false));
        return;
      }
      if (repeat === "repeat") {
        const nextIndex = currentIndex + 1;
        const isShufflePage = pathname === "/shuffle";

        if (nextIndex < songs.length) {
          dispatch(setPlayingSong(songs[nextIndex]));
        } else if (!isShufflePage) {
          // Only loop back to the start if we are NOT on the mystery shuffle discovery page
          dispatch(setPlayingSong(songs[0]));
        }
        dispatch(setPlaying(true));
      }
    }

    //All cases when shuffle is true
    if (shuffle) {
      if (repeat === "single") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        dispatch(setPlaying(true));
        return;
      }
      if (repeat === "noRepeat") {
        dispatch(setPlayingSong(null));
        dispatch(setPlaying(false));
        dispatch(setRepeat("repeat"));
        return;
      }
      if (repeat === "repeat") {
        const nextIndex = getNextShuffleSongIndex();
        dispatch(setPlayingSong(songs[nextIndex]));
        dispatch(setPlaying(true));
        return;
      }
    }
  }
  const moveToNextSong = () => {
    const currentIndex = songs.findIndex((s) => s._id === playingSong?._id);
    if (currentIndex === -1) {
      dispatch(setPlayingSong(null));
      dispatch(setPlaying(false));
      return;
    }

    // discovery-style navigation: don't loop back to start in Shuffle mode
    const isShufflePage = pathname === "/shuffle";

    //All cases when shuffle is false
    if (!shuffle) {
      if (repeat === "single") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        dispatch(setPlaying(true));
        return;
      }
      if (repeat === "noRepeat") {
        const nextIndex = currentIndex + 1;
        if (nextIndex < songs.length) {
          dispatch(setPlayingSong(songs[nextIndex]));
        } else if (!isShufflePage) {
          dispatch(setPlayingSong(songs[0]));
        }
        dispatch(setPlaying(true));
        dispatch(setRepeat("repeat"));
        return;
      }
      if (repeat === "repeat") {
        const nextIndex = currentIndex + 1;
        if (nextIndex < songs.length) {
          dispatch(setPlayingSong(songs[nextIndex]));
        } else if (!isShufflePage) {
          dispatch(setPlayingSong(songs[0]));
        }
        dispatch(setPlaying(true));
      }
    }
    //All cases when shuffle is true
    if (shuffle) {
      if (repeat === "single") {
        const nextIndex = getNextShuffleSongIndex();
        dispatch(setPlayingSong(songs[nextIndex]));
        dispatch(setPlaying(true));
        return;
      }
      if (repeat === "noRepeat") {
        const nextIndex = getNextShuffleSongIndex();
        dispatch(setPlayingSong(songs[nextIndex]));
        dispatch(setPlaying(true));
        dispatch(setRepeat("repeat"));
        return;
      }
      if (repeat === "repeat") {
        const nextIndex = getNextShuffleSongIndex();
        dispatch(setPlayingSong(songs[nextIndex]));
        dispatch(setPlaying(true));
      }
    }
  };
  const moveToPreviousSong = () => {
    const currentIndex = songs.findIndex((s) => s._id === playingSong?._id);
    if (currentIndex === -1) {
      dispatch(setPlayingSong(null));
      return;
    }

    const isShufflePage = pathname === "/shuffle";
    const previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
      if (isShufflePage) {
        // In discovery mode, don't loop back to the end. Just restart the first song.
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      } else {
        dispatch(setPlayingSong(songs[songs.length - 1]));
      }
    } else {
      dispatch(setPlayingSong(songs[previousIndex]));
    }
    dispatch(setPlaying(true));
  };
  useMediaSession(playing, playingSong, {
    moveToNextSong: customFns?.next ?? moveToNextSong,
    moveToPreviousSong: customFns?.previous ?? moveToPreviousSong,
  });
  return {
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  };
};
