"use client";
import React, { useEffect } from "react";
import type { Song } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import useMediaSession from "./useMediaSession";

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

  //    Play or pause audio based on playingSong and playing state
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (playingSong?.fileUrl) {
      // If the source changed, update it and reset time
      if (audioEl.src !== playingSong.fileUrl) {
        audioEl.src = playingSong.fileUrl;
        audioEl.currentTime = 0;
      }

      // Sync play/pause state
      if (playing) {
        audioEl.play().catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Audio play error", err);
          }
        });
      } else {
        audioEl.pause();
      }
    } else {
      audioEl.pause();
      audioEl.src = "";
    }
  }, [playingSong?.fileUrl, playing, audioRef]);

  //song time related data updatation
  useEffect(() => {
    const song = audioRef.current;
    if (!song) {
      return;
    }
    const onLoadMetadata = () => {
      dispatch(setDuration(song.duration ?? 0));
    };
    const onTimeUpdate = () => {
      dispatch(setCurrentTime(song.currentTime ?? 0));
    };
    song.addEventListener("loadedmetadata", onLoadMetadata);
    song.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      song.removeEventListener("loadedmetadata", onLoadMetadata);
      song.removeEventListener("timeupdate", onTimeUpdate);
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
        if (nextIndex < songs.length) {
          dispatch(setPlayingSong(songs[nextIndex]));
        } else {
          //in next update after shifting to redux store ,need to fetch songs here then if if i get 0 songs then only i should go to the first song          dispatch(setPlayingSong(songs[0]));
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
        const nextIndex = currentIndex + 1;
        if (nextIndex < songs.length) {
          dispatch(setPlayingSong(songs[nextIndex]));
        } else {
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
        } else {
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
    }
    const previousSong = currentIndex - 1;
    if (previousSong < 0) {
      dispatch(setPlayingSong(songs[songs.length - 1]));
    } else {
      dispatch(setPlayingSong(songs[previousSong]));
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
