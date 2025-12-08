import { useEffect, useRef, useState, useCallback } from "react";
import { searchSong } from "../services/song.services";
import type { songsReturnType } from "../services/song.services";
import SongList from "../components/SongList";
import { useAppSelector, useAppDispatch } from "../store/hook";
import SongPlayerPanel from "../components/SongPlayerPanel";
import { fadeOutPanel } from "../hooks/useAudioPlayer";
import {
  setLoading,
  setPanelOpen,
  setPlaying,
  setPlayingSong,
  setTempSongs,
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
} from "../reduxSlices/song/songSlice";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import DeleteConfirmation from "../components/DeleteConfirmation";
import DownloadConfirmation from "../components/DownloadConfirmation";
import axios from "axios";

const SearchSongs = () => {
  const searchedSongs = useAppSelector((state) => state.song.tempSongs);
  const playing = useAppSelector((state) => state.song.playing);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const loading = useAppSelector((state) => state.song.loading);
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const hasMoreSongs = useAppSelector((state) => state.song.tempHasMoreSongs);
  const downloading = useAppSelector((state) => state.song.downloading);
  const deleting = useAppSelector((state) => state.song.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.song.mountDeleteConfirmation
  );
  const mountDownloadConfirmation = useAppSelector(
    (state) => state.song.mountDownloadConfirmation
  );
  const dispatch = useAppDispatch();
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
    [dispatch]
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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-center">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            debounceSearch(value, 400);
          }}
          className="w-full p-3 border-2 rounded-lg mb-[14px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Start typing to find your favorite songs!"
        />
      </div>

      <SongList
        handlePlayClick={handlePlayClick}
        playing={playing}
        playingSong={playingSong}
        songs={searchedSongs}
        isTemp={true}
      />

      {hasMoreSongs && !loading && searchedSongs.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={loadMoreSongs}
          >
            Load More
          </button>
        </div>
      )}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />
      {playingSong && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-5xl z-50">
          <SongPlayerPanel
            audioRef={audioRef as React.RefObject<HTMLAudioElement>}
            panelRef={panelRef}
            fadeOutPanel={fadeOutPanel}
            handlePlayPause={() => {
              if (!playing) {
                audioRef.current?.play();
                dispatch(setPlaying(true));
                return;
              }
              audioRef.current?.pause();
              dispatch(setPlaying(false));
            }}
            moveToNextSong={moveToNextSong}
            moveToPreviousSong={moveToPreviousSong}
          />
        </div>
      )}

      {(loading || error) && (
        <p className="text-center mt-4 text-gray-600">
          {statusText || "Loading..."}
        </p>
      )}

      {!loading && searchedSongs.length === 0 && query && (
        <p className="text-center mt-4 text-gray-500 italic">
          No songs found. Try a different vibe or artist name 🎧
        </p>
      )}

      {!hasMoreSongs && searchedSongs.length > 0 && !loading && (
        <p className="text-center mt-4 text-gray-600">
          You have reached the end of the list.
        </p>
      )}

      {mountDeleteConfirmation && playingSong && (
        <DeleteConfirmation
          title={playingSong.title}
          songId={playingSong._id}
          moveToNextSong={moveToNextSong}
          temp={true}
        />
      )}
      {mountDownloadConfirmation && (
        <DownloadConfirmation title={playingSong!.title} />
      )}

      {(downloading || deleting || loading) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </div>
  );
};

export default SearchSongs;
