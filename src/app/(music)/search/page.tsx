"use client";
import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import {
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
  setTempSongs,
} from "@/reduxSlices/song/songSlice";
import {
  setPlaying,
  setExpandedPanelOpen,
  setPlayingSong,
  setExpandedPanelTrigger,
  setMiniPanelOpen,
} from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import ShareSongModal from "@/components/Modal/ShareSongModal";
import AuthPromptModal from "@/components/Modal/AuthPromptModal";
import MiniPlayer from "@/components/SongPlayerPanel/MiniPlayer";
import ExpandedPlayer from "@/components/SongPlayerPanel/ExpandedPlayer";
import { Search, X } from "lucide-react";
import { searchSong, songsReturnType } from "@/services/song.services";


const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const tempSongs = useAppSelector((state) => state.song.tempSongs);
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);
  const mountDeleteConfirmation = useAppSelector((state) => state.ui.mountDeleteConfirmation);
  const mountDownloadConfirmation = useAppSelector((state) => state.ui.mountDownloadConfirmation);
  const mountShareModal = useAppSelector((state) => state.ui.mountShareModal);
  const mountAuthPromptModal = useAppSelector((state) => state.ui.mountAuthPromptModal);
  const tempHasMoreSongs = useAppSelector((state) => state.song.tempHasMoreSongs);
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const tempTriggerFetch = useAppSelector((state) => state.song.tempTriggerFetch);

  const audioRef = useRef<HTMLAudioElement>(null);

  const { handlePlayClick, handleAudioEnded, moveToNextSong, moveToPreviousSong } =
    useAudioPlayer({ audioRef, songs: tempSongs });

  // Clear state on unmount
  useEffect(() => {
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(true));
      dispatch(setTempNextCursor(undefined));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setMiniPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

 useEffect(() => {
  if (!submittedQuery.trim()) {
    dispatch(replaceTempSongs([]));
    dispatch(setTempHasMoreSongs(false));
    return;
  }
  const fetchSongs = async () => {
    try {
      dispatch(setLoading(true));
      const data = await searchSong({ query: submittedQuery.trim(), limit: 10 });
      dispatch(replaceTempSongs(data.songs));
      dispatch(setTempNextCursor(data.nextCursor));
      dispatch(setTempHasMoreSongs(data.hasMoreSongs));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  fetchSongs();
}, [submittedQuery, dispatch]);

useEffect(() => {
  if (!submittedQuery.trim() || !tempNextCursor || !tempHasMoreSongs) return;

  const fetchMoreSongs = async () => {
    try {
      dispatch(setLoading(true));
      console.log("Fetching more songs for:", submittedQuery, "with cursor:", tempNextCursor);
      const data = await searchSong({
        query: submittedQuery.trim(),
        limit: 10,
        cursor: tempNextCursor
      });
      console.log("Received data:", data);
      if (data.songs.length > 0) {
        dispatch(setTempSongs(data.songs));
        dispatch(setTempNextCursor(data.nextCursor));
        dispatch(setTempHasMoreSongs(data.hasMoreSongs));
      } else {
        dispatch(setTempHasMoreSongs(false));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  fetchMoreSongs();
}, [tempTriggerFetch]);

 const handleClear = () => {
  setInputValue("");
  setSubmittedQuery("");
  dispatch(replaceTempSongs([]));
  dispatch(setTempHasMoreSongs(false));
};

const handleSearch = () => {
  if (!inputValue.trim()) return;
  setSubmittedQuery(inputValue.trim());
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") handleSearch();
};
  const hasSearched = submittedQuery.trim().length > 0;
  const noResults = hasSearched && tempSongs.length === 0 && !loading;

  return (
    <main className={`max-w-5xl mx-auto p-4 min-h-screen text-white ${playing && "mb-[192px]"}`}>

      {/* ── Search Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-purple-400 transition-colors">
          <Search className="w-5 h-5 text-purple-300 shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search songs, artists..."
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
          />
          {inputValue && (
            <button onClick={handleClear} className="text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={!inputValue.trim()}
            className="ml-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Results Header ── */}
      {hasSearched && (
        <div className="mb-4">
          <p className="text-purple-300 text-sm">
            {noResults
              ? `No results for "${submittedQuery}"`
              : `Results for "${submittedQuery}"`}
          </p>
        </div>
      )}

      {/* ── Empty State (before any search) ── */}
      {!hasSearched && (
        <div className="flex flex-col items-center justify-center mt-24 gap-3 text-white/30">
          <Search className="w-12 h-12" />
          <p className="text-sm">Type something to search</p>
        </div>
      )}

      {/* ── No Results State ── */}
      {noResults && (
        <div className="flex flex-col items-center justify-center mt-24 gap-3 text-white/30">
          <Search className="w-12 h-12" />
          <p className="text-sm">No songs found for "{submittedQuery}"</p>
        </div>
      )}

      {/* ── Song List ── */}
      {hasSearched && (
        loading && tempSongs.length < 10 ? (
          <SongListSkeleton rows={10} />
        ) : (
          <SongList
            handlePlayClick={handlePlayClick}
            playing={playing}
            playingSong={playingSong}
            songs={tempSongs}
            isTemp={true}
          />
        )
      )}

      {/* Audio Element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} preload="metadata" hidden />

      {/* ── Mobile MiniPlayer ── */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-50">
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

      {/* ── Modals ── */}
      {mountDeleteConfirmation && playingSong && (
        <DeleteConfirmation
          title={playingSong.title}
          songId={playingSong._id}
          moveToNextSong={moveToNextSong}
        />
      )}
      {mountDownloadConfirmation && playingSong && (
        <DownloadConfirmation title={playingSong.title} />
      )}
      {mountShareModal && playingSong && (
        <ShareSongModal songId={playingSong._id} title={playingSong.title} />
      )}
      {mountAuthPromptModal && playingSong && <AuthPromptModal />}

      {/* ── Inline loader (loading more) ── */}
      {loading && tempSongs.length >= 10 && (
        <p className="text-center mt-4 text-purple-200">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin inline-block" />
        </p>
      )}

      {/* ── End of results ── */}
      {!tempHasMoreSongs && tempSongs.length > 0 && (
        <p className="text-center mt-4 text-purple-200">
          You have reached the end of the results.
        </p>
      )}

      {/* ── Global action spinner ── */}
      {(downloading || deleting) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}
    </main>
  );
};

export default SearchPage;