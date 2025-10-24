import { useEffect, useRef, useState } from "react";
import { searchSong } from "../services/song.services";
import type { songsReturnType } from "../services/song.services";
import SongList from "../components/MusicPageComponents/SongList";
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
import DeleteConfirmation from "../components/MusicPageComponents/DeleteConfirmation";
import axios from "axios";

const SearchSongs = () => {
  const searchedSongs = useAppSelector((state) => state.song.tempSongs);
  const playing = useAppSelector((state) => state.song.playing);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const loading = useAppSelector((state) => state.song.loading);
  const tempTriggerFetch = useAppSelector(
    (state) => state.song.tempTriggerFetch
  );
  const hasMoreSongs = useAppSelector((state) => state.song.tempHasMoreSongs);
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const downloading = useAppSelector((state) => state.song.downloading);
  const deleting = useAppSelector((state) => state.song.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.song.mountDeleteConfirmation
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ panelRef, audioRef, songs: searchedSongs });
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debounceSearch = (query: string, delay: number) => {
    dispatch(setLoading(true));
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("aborted");
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    timerRef.current = window.setTimeout(async () => {
      try {
        if (!query || query === "") {
          setStatusText("");
          dispatch(replaceTempSongs([]));
          return;
        }
        const response: songsReturnType = await searchSong({
          query,
          cursor: tempNextCursor,
          signal: controller.signal,
        });
        const songs = response.songs;
        dispatch(setTempNextCursor(response.nextCursor));
        dispatch(setTempHasMoreSongs(response.hasMoreSongs));
        dispatch(setTempSongs(songs));
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
  };

  useEffect(() => {
    if (!hasMoreSongs) {
      return;
    }
    debounceSearch(query, 0);
  }, [tempTriggerFetch]);

  useEffect(() => {
    //write code for focusing on input upon opening this page
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-center">
        <input
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value.trim());
            dispatch(setTempNextCursor(undefined));
            dispatch(replaceTempSongs([]));
            debounceSearch(value.trim(), 250);
            //i think because of this 250 second param, when i type too fast the last text doesnt get searched in db, the previous one captured text might only be searched in db and the results of that show there at the page.
          }}
          className="w-full p-3 border-2 rounded-lg mb-[14px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Start typing to find your favorite songs!"
          id="songQuery"
          ref={inputRef}
        />
      </div>
      <SongList
        handlePlayClick={handlePlayClick}
        playing={playing}
        playingSong={playingSong}
        songs={searchedSongs}
        isTemp={true}
      />

      {playingSong && (
        <>
          <audio
            ref={audioRef}
            onEnded={handleAudioEnded}
            preload="metadata"
            hidden
          />
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
        </>
      )}
      {(loading || error) && (
        <p className="text-center mt-4 text-gray-600">{statusText}</p>
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
      {(downloading || deleting || loading) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </div>
  );
};

export default SearchSongs;
