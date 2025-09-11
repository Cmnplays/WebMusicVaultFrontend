import React, { useEffect } from "react";
import type { Song } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import gsap from "gsap";

import {
  setPanelOpen,
  setPlaying,
  setRepeat,
  setPlayingSong,
  setDuration,
  setCurrentTime,
  setPanelTrigger,
} from "../reduxSlices/song/songSlice";

export const fadeOutPanel = (
  panelElement: HTMLDivElement,
  onComplete?: () => void
) => {
  gsap.to(panelElement, {
    y: "100%",
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete,
  });
};
export const useAudioPlayer = ({
  panelRef,
  audioRef,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) => {
  const dispatch = useAppDispatch();
  const songs = useAppSelector((state) => state.song.songs);
  const panelOpen = useAppSelector((state) => state.song.panelOpen);
  const playing = useAppSelector((state) => state.song.playing);
  const repeat = useAppSelector((state) => state.song.repeat);
  const shuffle = useAppSelector((state) => state.song.shuffle);
  const playingSong = useAppSelector((state) => state.song.playingSong);

  //    Play or pause audio based on playingSong change
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (playingSong?.fileUrl) {
      if (audioEl.src !== playingSong.fileUrl) {
        audioEl.src = playingSong.fileUrl;
      }
      audioEl.currentTime = 0;
      audioEl.play().catch((err) => console.error("Audio play error", err));
    } else {
      audioEl.pause();
      audioEl.src = "";
    }
  }, [playingSong]);

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
  }, [dispatch]);

  // Handle play button click
  function handlePlayClick(song: Song) {
    if (playingSong?._id === song._id) {
      if (playing) {
        if (panelRef.current) {
          fadeOutPanel(panelRef.current, () => {
            dispatch(setPlayingSong(null));
            dispatch(setPanelOpen(false));
          });
        }
      } else {
        dispatch(setPlaying(true));
        audioRef.current?.play();
        if (!panelOpen) {
          dispatch(setPanelTrigger());
        }
      }
    } else {
      if (!song.fileUrl) {
        alert("Audio not available for this song.");
        setPlaying(false);
        return;
      }
      if (!panelOpen) {
        dispatch(setPanelTrigger());
        dispatch(setPanelOpen(true));
      }
      dispatch(setPlayingSong(song));
      dispatch(setPlaying(true));
    }
  }
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
        audioRef.current!.currentTime = 0;
        audioRef.current!.play();
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
          //in next update after shifting to like redux store ,need to fetch songs here then if if i get 0 songs then only i should go to the first song          dispatch(setPlayingSong(songs[0]));
        }
        dispatch(setPlaying(true));
      }
    }

    //All cases when shuffle is true
    if (shuffle) {
      if (repeat === "single") {
        audioRef.current!.currentTime = 0;
        audioRef.current!.play();
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
        audioRef.current!.currentTime = 0;
        audioRef.current!.play();
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

  return {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  };
};
