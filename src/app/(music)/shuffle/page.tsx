"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { usePlaySong } from "@/hooks/usePlaySong";
import {
  setTempSongs,
  replaceTempSongs,
  setSongsType,
} from "@/reduxSlices/song.slice";
import {
  setPlaying,
  setExpandedPanelOpen,
  setPlayingSong,
  setMiniPanelOpen,
} from "@/reduxSlices/player.slice";
import { setLoading } from "@/reduxSlices/ui.slice";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { getRandomSong } from "@/services/song.services";
import { Shuffle } from "lucide-react";

const ShufflePlayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const repeat = useAppSelector((state) => state.player.repeat);

  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);

  const songs = useAppSelector((state) => state.song.tempSongs);
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const [initLoading, setInitLoading] = useState(true);
  const [fetchingNext, setFetchingNext] = useState(false);
  const [initError, setInitError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  // Tracks the highest song index the user has reached — only grows, never shrinks
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(0);

  const { handlePlayClick } = usePlaySong();

  // ── Init: fetch first batch and auto‑play ──
  useEffect(() => {
    document.title = "Shuffle Mode | WmV";
    if (shouldFetchUser) return;
    dispatch(setSongsType("tempSongs"));
    let mounted = true;
    const init = async () => {
      try {
        setInitLoading(true);
        setInitError(false);
        const randomSongs = await getRandomSong();
        if (!mounted) return;
        dispatch(replaceTempSongs(randomSongs));
        dispatch(setPlayingSong(randomSongs[0]));
        setMaxVisibleIndex(0); // start by showing only the first song
        dispatch(setPlaying(true));
        dispatch(setMiniPanelOpen(true));
      } catch (err) {
        console.error("Failed to load initial random songs", err);
        if (mounted) setInitError(true);
      } finally {
        if (mounted) setInitLoading(false);
      }
    };
    init();

    return () => {
      mounted = false;
      dispatch(replaceTempSongs([]));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch, shouldFetchUser, retryTick]);

  // ── Grow visible window whenever the playing song advances ──
  useEffect(() => {
    if (!playingSong || songs.length === 0) return;
    const currentIdx = songs.findIndex((s) => s._id === playingSong._id);
    if (currentIdx === -1) return;
    // Only grow — going back to a previous song won't shrink the visible list
    setMaxVisibleIndex((prev) => Math.max(prev, currentIdx));
  }, [playingSong?._id, songs]);

  // ── Pre-fetch more random songs when nearing the end of the buffer ──
  useEffect(() => {
    if (!playingSong || songs.length === 0) return;
    if (repeat !== "repeat") return;

    const currentIdx = songs.findIndex((s) => s._id === playingSong._id);
    if (currentIdx < songs.length - 1) return;

    let mounted = true;
    const prefetch = async () => {
      if (fetchingNext) return;
      setFetchingNext(true);
      try {
        const nextSongs = await getRandomSong();
        if (mounted) {
          // Filter out any songs that already exist in the buffer
          const existingIds = new Set(songs.map((s) => s._id));
          const uniqueNewSongs = nextSongs.filter(
            (s) => !existingIds.has(s._id),
          );
          if (uniqueNewSongs.length > 0) {
            dispatch(setTempSongs(uniqueNewSongs));
          }
        }
      } catch (e) {
        console.error("Failed to pre-fetch next songs", e);
      } finally {
        if (mounted) setFetchingNext(false);
      }
    };
    prefetch();

    return () => {
      mounted = false;
    };
  }, [playingSong?._id, songs.length, repeat, dispatch]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
          🔀 Shuffle Mode
        </h2>
      </div>

      {/* Song List */}
      {initLoading ? (
        <SongListSkeleton rows={10} />
      ) : initError ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Shuffle className="w-10 h-10 text-red-300/60" />
          <p className="text-red-300 text-sm">
            Couldn&apos;t start shuffle mode. Please check your connection and
            try again.
          </p>
          <button
            type="button"
            onClick={() => setRetryTick((t) => t + 1)}
            className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <SongList
          handlePlayClick={handlePlayClick}
          playing={playing}
          playingSong={playingSong}
          songs={songs.slice(0, maxVisibleIndex + 1)}
          isTemp={true}
        />
      )}

      {loading && (
        <p className="text-center mt-4 text-purple-200 whitespace-pre-line">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin inline-block" />
        </p>
      )}

      {fetchingNext && (
        <p className="text-center mt-4 text-purple-200">
          <i className="ri-loader-2-line text-purple-300 text-3xl animate-spin inline-block" />
        </p>
      )}

      {(downloading || deleting) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}
    </>
  );
};

export default ShufflePlayer;
