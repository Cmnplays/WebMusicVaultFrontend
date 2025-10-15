import React, { useState, useEffect } from "react";
import { fetchAllSongs } from "../services/song.services";
import type { Song } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import axios from "axios";
import { fadeOutPanel } from "./useAudioPlayer";
import {
  setSongs,
  setStatusText,
  setLoading,
  setPanelOpen,
  setPlayingSong,
  handleSortByChange,
  setSortChanged,
  setPage,
  setSortOrder,
  setHasMoreSongs,
} from "../reduxSlices/song/songSlice";

export const useSongs = (panelRef: React.RefObject<HTMLDivElement | null>) => {
  const dispatch = useAppDispatch();
  const sortChanged = useAppSelector((state) => state.song.sortChanged);
  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const page = useAppSelector((state) => state.song.page);
  const hasMoreSongs = useAppSelector((state) => state.song.hasMoreSongs);
  const Limit = 10;
  const [error, setError] = useState(false);

  // Fetch songs on page or initial load
  useEffect(() => {
    if (!hasMoreSongs) return;
    const loadSongs = async () => {
      dispatch(setLoading(true));
      try {
        setError(false);
        if (page === 1) {
          if (sortOrder === "asc")
            dispatch(
              setStatusText(
                "Fetching songs... Newest to Oldest.\n(First load may take up to a minute as the server wakes up)"
              )
            );
          else
            dispatch(
              setStatusText(
                "Fetching songs... Oldest to Newest.\n(First load may take up to a minute as the server wakes up)"
              )
            );
        } else {
          dispatch(setStatusText("Loading more songs..."));
        }

        const newSongs: Song[] = await fetchAllSongs(Limit, page, sortOrder);

        if (sortChanged) {
          dispatch(handleSortByChange(newSongs));
          dispatch(setSortChanged(false));
        } else {
          dispatch(setSongs(newSongs));
        }

        if (newSongs.length < Limit) {
          dispatch(setHasMoreSongs(false));
        }
      } catch (err: unknown) {
        setError(true);

        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            dispatch(
              setStatusText("Request timed out. Please try again later.")
            );
          } else {
            dispatch(setStatusText("Something went wrong. Please try again."));
          }
        } else if (err instanceof Error) {
          dispatch(
            setStatusText("Unexpected error occurred. Please try again.")
          );
        } else {
          dispatch(setStatusText("An unknown error occurred."));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadSongs();
  }, [page, sortOrder, sortChanged, hasMoreSongs, dispatch]);

  const handleSorting = () => {
    dispatch(setSortChanged(true));
    dispatch(setSongs([]));
    dispatch(setPage(1));
    if (sortOrder === "asc") {
      dispatch(setSortOrder("desc"));
    } else {
      dispatch(setSortOrder("asc"));
    }
    dispatch(setHasMoreSongs(true));
    if (panelRef.current) {
      fadeOutPanel(panelRef.current, () => {
        dispatch(setPlayingSong(null));
        dispatch(setPanelOpen(false));
      });
    }
  };

  return { handleSorting, error, hasMoreSongs };
};
