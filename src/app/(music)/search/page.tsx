"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { usePlaySong } from "@/hooks/usePlaySong";
import {
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
  setTempSongs,
  setTempSortChanged,
  setSongsType,
} from "@/reduxSlices/song.slice";
import { setExpandedPanelOpen } from "@/reduxSlices/player.slice";
import { setLoading } from "@/reduxSlices/ui.slice";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { Search, X } from "lucide-react";
import { searchSong } from "@/services/song.services";
import MusicHeader from "@/components/MusicPage/MusicPageHeader";
import { handleSortBy, handleSortOrder } from "@/utils/songUtils";
import { showToast } from "@/hooks/useToast";

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tempSongs = useAppSelector((state) => state.song.tempSongs);
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);
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

  // Error / retry state for the initial search request
  const [searchError, setSearchError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  // Clear state on unmount
  useEffect(() => {
    document.title = "Search Songs | WmV";
    dispatch(setSongsType("tempSongs"));
    // Auto focus search box
    inputRef.current?.focus();
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(true));
      dispatch(setTempNextCursor(undefined));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch, tempSortChanged]);

  // Clear any pending debounced search on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!submittedQuery.trim()) {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(false));
      return;
    }
    const fetchSongs = async () => {
      try {
        dispatch(setLoading(true));
        setSearchError(false);
        const data = await searchSong({
          query: submittedQuery,
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
        setSearchError(true);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSongs();
  }, [submittedQuery, dispatch, tempSortChanged, tempSortBy, tempSortOrder, retryTick]);

  useEffect(() => {
    if (!submittedQuery.trim() || !tempNextCursor || !tempHasMoreSongs) return;

    const fetchMoreSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await searchSong({
          query: submittedQuery,
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
        showToast({
          message: "Couldn't load more results. Please try again.",
          type: "error",
        });
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMoreSongs();
  }, [tempTriggerFetch]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    // Debounce live search (400ms) so we don't hammer the endpoint on every
    // keystroke. The raw input is passed straight through so Atlas fuzzy
    // matching gets exactly what the user typed.
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (rawValue.trim()) {
      debounceRef.current = setTimeout(() => {
        setSubmittedQuery(rawValue);
      }, 400);
    } else {
      setSubmittedQuery("");
    }
  };

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue("");
    setSubmittedQuery("");
    dispatch(replaceTempSongs([]));
    dispatch(setTempHasMoreSongs(false));
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    // Cancel any pending debounced search and submit the raw input as-is.
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSubmittedQuery(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  const hasSearched = submittedQuery.trim().length > 0;
  const noResults =
    hasSearched && tempSongs.length === 0 && !loading && !searchError;

  return (
    <>
      {/* ── Search Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-purple-400 transition-colors">
          <Search className="w-5 h-5 text-purple-300 shrink-0" />
          <input
            type="search"
            id="search-songs"
            ref={inputRef}
            value={inputValue}
            onChange={handleSearchInputChange}
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
            className="ml-1 shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
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
              : searchError
                ? ""
                : `Results for "${submittedQuery}"`}
          </p>
        </div>
      )}

      {/* ── Search Error State ── */}
      {searchError && !loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <Search className="w-10 h-10 text-red-300/60" />
          <p className="text-red-300 text-sm">
            Couldn&apos;t load results. Please check your connection and try
            again.
          </p>
          <button
            type="button"
            onClick={() => setRetryTick((t) => t + 1)}
            className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Retry
          </button>
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

      {/* ── Global action spinner ── */}
      {deleting && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}
    </>
  );
};

export default SearchPage;
