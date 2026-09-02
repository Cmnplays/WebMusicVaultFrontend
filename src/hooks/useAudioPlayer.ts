"use client";
import React, { useEffect } from "react";
import type { Song } from "../services/song.services";
import { getSongWithId } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import store from "../store/store";
import useMediaSession from "./useMediaSession";

import { usePathname } from "next/navigation";

import {
  setPlaying,
  setRepeat,
  setPlayingSong,
  setDuration,
  setCurrentTime,
  setExpandedPanelOpen,
  dequeueUpNext,
} from "../reduxSlices//player.slice";

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
  const playing = useAppSelector((state) => state.player.playing);
  const repeat = useAppSelector((state) => state.player.repeat);
  const shuffle = useAppSelector((state) => state.player.shuffle);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const pathname = usePathname();

  //    Play or pause audio based on playingSong and playing state
  const isInitialMount = React.useRef(true);

  // Latest values for use inside stable listeners (registered once below)
  const playingSongRef = React.useRef(playingSong);
  const currentTimeRef = React.useRef(currentTime);
  React.useEffect(() => {
    playingSongRef.current = playingSong;
    currentTimeRef.current = currentTime;
  });
  // Recovery bookkeeping: on a playback failure the error listener silently
  // re-fetches a fresh URL once, keeps the position, and never loops. Signed
  // CDN URLs no longer expire on a timer, so this is now a general resilience
  // net (transient errors / post-API-secret-rotation), not an expiry path.
  const recoveringUrlRef = React.useRef<string | null>(null);
  const retriedUrlRef = React.useRef<string | null>(null);
  const wasPlayingRef = React.useRef(false);

  useEffect(() => {
    // User-initiated play (paused -> playing) starts a new recovery
    // episode: re-allow the error listener to refetch, even if this exact
    // URL failed recovery before.
    if (playing && !wasPlayingRef.current) {
      retriedUrlRef.current = null;
    }
    wasPlayingRef.current = playing;

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

      // Restore saved time on first load after refresh, or when recovering
      // from a playback failure so the listener keeps their position.
      const isRecovery = recoveringUrlRef.current === playingSong.fileUrl;
      const savedTime = currentTimeRef.current;
      if ((isInitialMount.current || isRecovery) && savedTime > 0) {
        audioEl.currentTime = savedTime;
      } else {
        audioEl.currentTime = 0;
      }
      if (isRecovery) {
        recoveringUrlRef.current = null;
      }
    }

    if (playing) {
      const cleanTitle = playingSong.title.replace(/\.mp3$/i, "");
      document.title = ` 🎧 ${cleanTitle} | WmV`;

      audioEl.play().catch((err) => {
        if (err.name !== "AbortError") {
          // A failed source load also triggers the `error` listener, which
          // recovers with a fresh URL — don't clobber the playing state here.
          // This is an expected, handled expiry path: stay quiet so the
          // Next.js dev "Issues" overlay isn't triggered by it.
          if (audioEl.error) {
            return;
          }
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

    // On a load/play failure, silently fetch a fresh URL for the same song
    // and swap it in; the play effect above then reloads with the saved
    // position. Runs at most once per failed URL so a genuinely
    // broken/deleted song can't loop forever. (Signed URLs no longer expire
    // on a timer, so this is a general resilience net, not an expiry path.)
    const handleError = () => {
      const currentSong = playingSongRef.current;
      const failedUrl = audioRef.current?.src;
      if (!currentSong?.fileUrl || !failedUrl) return;

      const retryKey = `${currentSong._id}::${failedUrl}`;
      if (retriedUrlRef.current === retryKey) return;
      retriedUrlRef.current = retryKey;

      (async () => {
        try {
          const freshSong = await getSongWithId(currentSong._id);
          if (!freshSong?.fileUrl || freshSong.fileUrl === failedUrl) {
            // Unrecoverable: reflect the stopped state honestly.
            dispatch(setPlaying(false));
            return;
          }
          // Capture the real position at failure time: a mid-play failure
          // keeps its position; a just-advanced song reads back 0 instead of
          // the previous song's stale redux time.
          dispatch(setCurrentTime(audioRef.current?.currentTime ?? 0));
          recoveringUrlRef.current = freshSong.fileUrl;
          dispatch(setPlayingSong(freshSong));
          // Keep playback going — the user initiated it before the URL died.
          dispatch(setPlaying(true));
          // Recovery succeeded: clean slate for any future episode.
          retriedUrlRef.current = null;
        } catch (e) {
          console.error("Failed to refresh song URL after audio error", e);
          dispatch(setPlaying(false));
        }
      })();
    };

    song.addEventListener("loadedmetadata", onLoadMetadata);
    song.addEventListener("timeupdate", onTimeUpdate);
    song.addEventListener("play", handleOnPlay);
    song.addEventListener("pause", handleOnPause);
    song.addEventListener("error", handleError);

    return () => {
      song.removeEventListener("loadedmetadata", onLoadMetadata);
      song.removeEventListener("timeupdate", onTimeUpdate);
      song.removeEventListener("play", handleOnPlay);
      song.removeEventListener("pause", handleOnPause);
      song.removeEventListener("error", handleError);
    };
  }, [dispatch, audioRef]);

  function getNextShuffleSongIndex(): number {
    return Math.floor(Math.random() * songs.length);
  }
  // "Play Next" queue takes priority over all shuffle/repeat/songs-array
  // logic: if a queued song exists, shift it off, play it, and skip the
  // rest of the next-song logic for this call. Previous-song is unaffected.
  function playFromUpNextQueue(): boolean {
    // Read the queue FRESH from the store at call time — not from this
    // render's closure — so a rapid second next/ended can't double-read a
    // stale snapshot and play the wrong song.
    const queue = store.getState().player.upNextQueue;
    if (queue.length === 0) return false;
    const nextSong = queue[0];
    dispatch(dequeueUpNext());
    dispatch(setPlayingSong(nextSong));
    dispatch(setPlaying(true));
    return true;
  }
  // New: Handle when current song ends, play next if available
  function handleAudioEnded() {
    if (playFromUpNextQueue()) return;
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
    if (playFromUpNextQueue()) return;

    const currentIndex = songs.findIndex((s) => s._id === playingSong?._id);
    if (currentIndex === -1) {
      dispatch(setPlayingSong(null));
      dispatch(setExpandedPanelOpen(false));
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
