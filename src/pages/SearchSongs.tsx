import { useEffect, useRef, useState } from "react";
import { searchSong } from "../services/song.services";
import type { Song } from "../services/song.services";
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
  setTempPage,
  setTempHasMoreSongs,
} from "../reduxSlices/song/songSlice";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import DeleteConfirmation from "../components/MusicPageComponents/DeleteConfirmation";
import axios from "axios";

const SearchSongs = () => {
  const searchedSongs = useAppSelector((state) => state.song.tempSongs);
  const playing = useAppSelector((state) => state.song.playing);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const loading = useAppSelector((state) => state.song.loading);
  const page = useAppSelector((state) => state.song.tempPage);
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
  const Limit = 10;
  const hasMoreSongs = useAppSelector((state) => state.song.tempHasMoreSongs);

  const debounceSearch = (query: string, delay: number, pageArg?: number) => {
    dispatch(setLoading(true));
    setStatusText("Loading...");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const pg = pageArg ?? page;
    timerRef.current = window.setTimeout(async () => {
      try {
        if (!query || query === "") {
          setStatusText("");
          dispatch(replaceTempSongs([]));
          return;
        }
        const songs: Song[] = await searchSong(query, pg, Limit);
        if (songs.length < Limit) {
          dispatch(setTempHasMoreSongs(false));
        }
        if (songs.length === 0) {
          setStatusText("No song found.");
        }
        dispatch(setTempSongs(songs));
      } catch (err: unknown) {
        setError(true);
        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            setStatusText("Request timed out. Please try again later.");
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
  }, [page]);

  useEffect(() => {
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-center">
        <input
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value.trim());
            dispatch(setTempPage(1));
            dispatch(setTempHasMoreSongs(true));
            dispatch(replaceTempSongs([]));
            //giving page as 1 even after setting temp page as 1 is because redux actions are asynchronous
            debounceSearch(value, 250, 1);
          }}
          className="w-full p-3 border-2 rounded-lg mb-[14px]"
          type="text"
          placeholder="Start typing to find your favorite songs!"
          id="songQuery"
        />
      </div>
      <SongList
        handlePlayClick={handlePlayClick}
        playing={playing}
        playingSong={playingSong}
        songs={searchedSongs}
        isTemp={true}
      />
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />

      {playingSong && (
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
      )}
      {(loading || error) && (
        <p className="text-center mt-4 text-gray-600">{statusText}</p>
      )}
      {!loading && searchedSongs.length === 0 && query && (
        <p className="text-center mt-4 text-gray-600">{statusText}</p>
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
