"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { usePlaySong } from "@/hooks/usePlaySong";
import {
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
  setTempSongs,
  setTempSortChanged,
  setSongsType,
} from "@/reduxSlices/song/songSlice";
import { setExpandedPanelOpen } from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { Search, X } from "lucide-react";
import { searchSong } from "@/services/song.services";
import MusicHeader from "@/components/MusicPage/MusicPageHeader";
import { handleSortBy, handleSortOrder } from "@/utils/songUtils";

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

  const tempHasMoreSongs = useAppSelector(
    (state) => state.song.tempHasMoreSongs,
  );
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const tempTriggerFetch = useAppSelector(
    (state) => state.song.tempTriggerFetch,
  );

  const { handlePlayClick } = usePlaySong();

  const tempSortOrder = useAppSelector((state) => state.song.tempSortOrder);
  const tempSortBy = useAppSelector((state) => state.song.tempSortBy);
  const tempSortChanged = useAppSelector((state) => state.song.tempSortChanged);

  // Clear state on unmount
  useEffect(() => {
    document.title = "Search Songs | WmV";
    dispatch(setSongsType("tempSongs"));
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(true));
      dispatch(setTempNextCursor(undefined));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch, tempSortChanged]);

  useEffect(() => {
    if (!submittedQuery.trim()) {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(false));
      return;
    }
    const fetchSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await searchSong({
          query: submittedQuery.trim(),
          limit: 10,
          sortBy: tempSortBy,
          sortOrder: tempSortOrder,
        });
        dispatch(replaceTempSongs(data.songs));
        dispatch(setTempNextCursor(data.nextCursor));
        dispatch(setTempHasMoreSongs(data.hasMoreSongs));
        if (tempSortChanged) {
          dispatch(setTempSortChanged(false));
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSongs();
  }, [submittedQuery, dispatch, tempSortChanged, tempSortBy, tempSortOrder]);

  useEffect(() => {
    if (!submittedQuery.trim() || !tempNextCursor || !tempHasMoreSongs) return;

    const fetchMoreSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await searchSong({
          query: submittedQuery.trim(),
          cursor: tempNextCursor,
          sortBy: tempSortBy,
          sortOrder: tempSortOrder,
        });
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
    <>
      {/* ── Search Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-purple-400 transition-colors">
          <Search className="w-5 h-5 text-purple-300 shrink-0" />
          <input
            type="search"
            id="search-songs"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search songs, artists..."
            aria-label="Search songs and artists"
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="text-white/40 hover:text-white transition-colors"
            >
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
      <MusicHeader
        isTemp={true}
        HandleSortBy={(sortBy) => handleSortBy(sortBy, dispatch, true)}
        HandleSortOrder={(sortOrder) =>
          handleSortOrder(sortOrder, dispatch, true)
        }
        sortOrder={tempSortOrder}
        sortBy={tempSortBy}
      />
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
          <p className="text-sm">
            No songs found for &quot;{submittedQuery}&quot;
          </p>
        </div>
      )}

      {/* ── Song List ── */}
      {hasSearched &&
        (loading && tempSongs.length < 10 ? (
          <SongListSkeleton rows={10} />
        ) : (
          <SongList
            handlePlayClick={handlePlayClick}
            playing={playing}
            playingSong={playingSong}
            songs={tempSongs}
            isTemp={true}
          />
        ))}

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
    </>
  );
};

export default SearchPage;
