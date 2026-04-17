"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { setTempSongs, replaceTempSongs } from "@/reduxSlices/song/songSlice";
import {
  setPlaying,
  setExpandedPanelOpen,
  setPlayingSong,
  setExpandedPanelTrigger,
  setMiniPanelOpen,
  setMiniPanelTrigger,
} from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import ShareSongModal from "@/components/Modal/ShareSongModal";
import AuthPromptModal from "@/components/Modal/AuthPromptModal";
import MiniPlayer from "@/components/SongPlayerPanel/MiniPlayer";
import ExpandedPlayer from "@/components/SongPlayerPanel/ExpandedPlayer";
import { getRandomSong } from "@/services/song.services";

const ShufflePlayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const repeat = useAppSelector((state) => state.player.repeat);

  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.ui.mountDeleteConfirmation,
  );
  const mountDownloadConfirmation = useAppSelector(
    (state) => state.ui.mountDownloadConfirmation,
  );
  const mountShareModal = useAppSelector((state) => state.ui.mountShareModal);
  const mountAuthPromptModal = useAppSelector(
    (state) => state.ui.mountAuthPromptModal,
  );

  const songs = useAppSelector((state) => state.song.tempSongs);
  const [initLoading, setInitLoading] = useState(true);
  const [fetchingNext, setFetchingNext] = useState(false);

  // Tracks the highest song index the user has reached — only grows, never shrinks
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Use the existing hook as-is — all repeat/shuffle logic handled internally
  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ audioRef, songs });

  // ── Init: fetch first batch and auto‑play ──
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        setInitLoading(true);
        const randomSongs = await getRandomSong();
        if (!mounted) return;
        dispatch(replaceTempSongs(randomSongs));
        dispatch(setPlayingSong(randomSongs[0]));
        setMaxVisibleIndex(0); // start by showing only the first song
        dispatch(setPlaying(true));
        dispatch(setMiniPanelOpen(true));
        dispatch(setMiniPanelTrigger());
      } catch (err) {
        console.error("Failed to load initial random songs", err);
      } finally {
        if (mounted) setInitLoading(false);
      }
    };
    init();

    return () => {
      mounted = false;
      dispatch(replaceTempSongs([]));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setMiniPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

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
          const uniqueNewSongs = nextSongs.filter((s) => !existingIds.has(s._id));
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
    <main
      className={`max-w-5xl mx-auto p-4 min-h-screen text-white ${playing && "mb-[192px]"}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
          🔀 Shuffle Mode
        </h2>
      </div>

      {/* Song List */}
      {initLoading ? (
        <SongListSkeleton rows={10} />
      ) : (
        <SongList
          handlePlayClick={handlePlayClick}
          playing={playing}
          playingSong={playingSong}
          songs={songs.slice(0, maxVisibleIndex + 1)}
        />
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />

      {/* ── MiniPlayer ── */}
      <div className="fixed bottom-16 lg:bottom-6 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-[500px] z-[60] lg:rounded-2xl lg:overflow-hidden lg:shadow-[0_-4px_30px_rgba(0,0,0,0.5)] lg:border lg:border-purple-500/20">
        <MiniPlayer
          audioRef={audioRef}
          handlePlayPause={async () => {
            if (!playing) {
              try {
                await audioRef.current?.play();
                dispatch(setPlaying(true));
              } catch (err) {
                console.warn("Audio play was interrupted", err);
              }
              return;
            }
            audioRef.current?.pause();
            dispatch(setPlaying(false));
          }}
          onExpand={() => {
            dispatch(setExpandedPanelTrigger());
            dispatch(setExpandedPanelOpen(true));
          }}
        />
      </div>

      <ExpandedPlayer
        audioRef={audioRef}
        handlePlayPause={async () => {
          if (!playing) {
            try {
              await audioRef.current?.play();
              dispatch(setPlaying(true));
            } catch (err) {
              console.warn("Audio play was interrupted", err);
            }
            return;
          }
          audioRef.current?.pause();
          dispatch(setPlaying(false));
        }}
        moveToNextSong={moveToNextSong}
        moveToPreviousSong={moveToPreviousSong}
      />

      {/* Delete Confirmation */}
      {mountDeleteConfirmation && (
        <DeleteConfirmation
          title={playingSong!.title}
          songId={playingSong!._id}
          moveToNextSong={moveToNextSong}
        />
      )}

      {mountDownloadConfirmation && (
        <DownloadConfirmation title={playingSong!.title} />
      )}

      {mountShareModal && playingSong && (
        <ShareSongModal songId={playingSong._id} title={playingSong.title} />
      )}
      {mountAuthPromptModal && playingSong && <AuthPromptModal />}

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
    </main>
  );
};

export default ShufflePlayer;
