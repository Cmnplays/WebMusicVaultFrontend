"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { searchSong } from "@/services/song.services";
import type { songsReturnType } from "@/services/song.services";
import SongList from "@/components/SongList/SongList";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import SongPlayerPanel from "@/components/ShufflePage/PlayerPanel";
import { fadeOutPanel } from "@/hooks/useAudioPlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import SearchInput from "@/components/SearchInput";
import axios from "axios";

import { setLoading } from "@/reduxSlices/ui/uiSlice";
import {
  setTempSongs,
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
} from "@/reduxSlices/song/songSlice";
import {
  setPanelOpen,
  setPlaying,
  setPlayingSong,
} from "@/reduxSlices/player/playerSlice";
import UnavailableYet from "@/components/UnavailableYet";

const SearchSongs = () => {
  const dispatch = useAppDispatch();
  const searchedSongs = useAppSelector((state) => state.song.tempSongs);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const loading = useAppSelector((state) => state.ui.loading);
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const hasMoreSongs = useAppSelector((state) => state.song.tempHasMoreSongs);
  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.ui.mountDeleteConfirmation,
  );
  const mountDownloadConfirmation = useAppSelector(
    (state) => state.ui.mountDownloadConfirmation,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState(false);

  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ panelRef, audioRef, songs: searchedSongs });

  //  Debounced search
  const debounceSearch = useCallback(
    (searchText: string, delay: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();

      dispatch(setLoading(true));
      setStatusText("");
      setError(false);
      dispatch(replaceTempSongs([]));
      dispatch(setTempNextCursor(undefined));

      const controller = new AbortController();
      abortControllerRef.current = controller;

      timerRef.current = window.setTimeout(async () => {
        if (!searchText || searchText.trim() === "") {
          dispatch(setLoading(false));
          return;
        }

        try {
          const response: songsReturnType = await searchSong({
            query: searchText.trim(),
            cursor: undefined, // always first page for new query
            signal: controller.signal,
          });

          dispatch(setTempSongs(response.songs || []));
          dispatch(setTempNextCursor(response.nextCursor || undefined));
          dispatch(setTempHasMoreSongs(response.hasMoreSongs));
        } catch (err: unknown) {
          setError(true);
          if (axios.isAxiosError(err)) {
            if (err.code === "ECONNABORTED") {
              setStatusText("Request timed out. Please try again later.");
            } else if (err.code === "ERR_CANCELLED") {
              return;
            } else {
              setStatusText("Something went wrong. Please try again.");
            }
          } else if (err instanceof Error) {
            setStatusText("Unexpected error occurred. Please try again.");
          } else {
            setStatusText("An unknown error occurred.");
          }
        } finally {
          dispatch(setLoading(false));
        }
      }, delay);
    },
    [dispatch],
  );

  // Load more for cursor pagination
  const loadMoreSongs = useCallback(async () => {
    if (!hasMoreSongs || loading || !tempNextCursor) return;

    dispatch(setLoading(true));
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response: songsReturnType = await searchSong({
        query,
        cursor: tempNextCursor,
        signal: controller.signal,
      });

      // Append new songs
      dispatch(setTempSongs([...searchedSongs, ...(response.songs || [])]));
      dispatch(setTempNextCursor(response.nextCursor || undefined));
      dispatch(setTempHasMoreSongs(response.hasMoreSongs));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          setStatusText("Request timed out. Please try again later.");
        }
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, searchedSongs, tempNextCursor, query, hasMoreSongs, loading]);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  // return (
  //   <div className="max-w-5xl h-screen mx-auto p-4 text-white">
  //     <SearchInput
  //       debounceSearch={debounceSearch}
  //       inputRef={inputRef}
  //       query={query}
  //       setQuery={setQuery}
  //     />

  //     {/* Song List */}
  //     <SongList
  //       handlePlayClick={handlePlayClick}
  //       playing={playing}
  //       playingSong={playingSong}
  //       songs={searchedSongs}
  //       isTemp={true}
  //     />

  //     {/* Load More Button */}
  //     {hasMoreSongs && !loading && searchedSongs.length > 0 && (
  //       <div className="flex justify-center mt-4">
  //         <button
  //           className="
  //           px-4 py-2 rounded-lg
  //           bg-purple-700 text-white
  //           hover:bg-purple-600
  //           transition-all duration-200
  //           shadow-md hover:shadow-lg
  //         "
  //           onClick={loadMoreSongs}
  //         >
  //           Load More
  //         </button>
  //       </div>
  //     )}

  //     {/* Audio Element */}
  //     <audio
  //       ref={audioRef}
  //       onEnded={handleAudioEnded}
  //       preload="metadata"
  //       hidden
  //     />

  //     {/* Player Panel */}
  //     {playingSong && (
  //       <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-5xl z-50">
  //         <SongPlayerPanel
  //           audioRef={audioRef as React.RefObject<HTMLAudioElement>}
  //           panelRef={panelRef}
  //           fadeOutPanel={fadeOutPanel}
  //           handlePlayPause={() => {
  //             if (!playing) {
  //               audioRef.current?.play();
  //               dispatch(setPlaying(true));
  //               return;
  //             }
  //             audioRef.current?.pause();
  //             dispatch(setPlaying(false));
  //           }}
  //           moveToNextSong={moveToNextSong}
  //           moveToPreviousSong={moveToPreviousSong}
  //         />
  //       </div>
  //     )}

  //     {/* Loading / Error */}
  //     {(loading || error) && (
  //       <p className="text-center mt-4 text-purple-200">
  //         {statusText || "Loading..."}
  //       </p>
  //     )}

  //     {/* No Songs Found */}
  //     {!loading && searchedSongs.length === 0 && query && (
  //       <p className="text-center mt-4 text-purple-300 italic">
  //         No songs found. Try a different vibe or artist name 🎧
  //       </p>
  //     )}

  //     {/* End of List */}
  //     {!hasMoreSongs && searchedSongs.length > 0 && !loading && (
  //       <p className="text-center mt-4 text-purple-200">
  //         You have reached the end of the list.
  //       </p>
  //     )}

  //     {/* Delete Confirmation */}
  //     {mountDeleteConfirmation && playingSong && (
  //       <DeleteConfirmation
  //         title={playingSong.title}
  //         songId={playingSong._id}
  //         moveToNextSong={moveToNextSong}
  //         temp={true}
  //       />
  //     )}

  //     {/* Download Confirmation */}
  //     {mountDownloadConfirmation && (
  //       <DownloadConfirmation title={playingSong!.title} />
  //     )}

  //     {/* Global Loader */}
  //     {(downloading || deleting || loading) && (
  //       <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
  //         <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
  //       </div>
  //     )}
  //   </div>
  // );
  return <UnavailableYet />;
};

export default SearchSongs;
