"use client";
import { useState, useEffect, useRef } from "react";
import { getSongs } from "../services/song.services";
import type { songsReturnType } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import axios from "axios";
import {
  setSongs,
  handleSortByChange,
  setSortChanged,
  setSortOrder,
  setHasMoreSongs,
  setNextCursor,
  setSortBy,
} from "../reduxSlices/song/songSlice";
import { setStatusText, setLoading } from "@/reduxSlices/ui/uiSlice";
import {
  setExpandedPanelOpen,
  setPlayingSong,
  setMiniPanelOpen,
} from "@/reduxSlices/player/playerSlice";

export const useSongs = () => {
  const dispatch = useAppDispatch();
  const sortChanged = useAppSelector((state) => state.song.sortChanged);
  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const sortBy = useAppSelector((state) => state.song.sortBy);
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const [error, setError] = useState(false);
  const triggerFetch = useAppSelector((state) => state.song.triggerFetch);
  const nextCursor = useAppSelector((state) => state.song.nextCursor);
  const songs = useAppSelector((state) => state.song.songs);
  const didMount = useRef(false);
  const isLoggingIn = useAppSelector(state=>state.auth.isLoggingIn)

  useEffect(() => {
    const loadSongs = async () => {
      // Don't fetch songs until initial auth check has completed
      if (shouldFetchUser || isLoggingIn) return;
      if (!didMount.current && songs.length > 0) {
        didMount.current = true;
        return; // skip only first mount
      }
      didMount.current = true;
      dispatch(setLoading(true));
      try {
        setError(false);
        if (!nextCursor) {
          if (sortOrder === "asc") {
            dispatch(setStatusText("Fetching songs... Newest to Oldest."));
          } else {
            dispatch(setStatusText("Fetching songs... Oldest to Newest."));
          }
        } else {
          dispatch(setStatusText("Loading more songs..."));
        }
        const response: songsReturnType = await getSongs({
          sortBy,
          sortOrder,
          cursor: nextCursor,
        });
        const newSongs = response.songs;
        dispatch(setNextCursor(response.nextCursor));
        dispatch(setHasMoreSongs(response.hasMoreSongs));

        if (sortChanged) {
          dispatch(handleSortByChange(newSongs));
          dispatch(setSortChanged(false));
        } else {
          dispatch(setSongs(newSongs));
        }
      } catch (err: unknown) {
        setError(true);

        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            dispatch(
              setStatusText("Request timed out. Please try again later."),
            );
          } else {
            dispatch(setStatusText("Something went wrong. Please try again."));
          }
        } else if (err instanceof Error) {
          dispatch(
            setStatusText("Unexpected error occurred. Please try again."),
          );
        } else {
          dispatch(setStatusText("An unknown error occurred."));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadSongs();
  }, [triggerFetch, sortOrder, sortChanged, dispatch, shouldFetchUser, isLoggingIn]);
  const handleSort = () => {
    dispatch(setSongs([]));
    dispatch(setNextCursor(undefined));
    dispatch(setSortChanged(true));
    dispatch(setHasMoreSongs(true));
    dispatch(setPlayingSong(null));
    dispatch(setExpandedPanelOpen(false)); // triggers desktop panel close animation
    dispatch(setMiniPanelOpen(false)); // triggers mini player close animation
  };
  const handleSortBy = (sortBy: sortByT) => {
    handleSort();
    dispatch(setSortBy(sortBy));
  };
  const handleSortOrder = (sortOrder: sortOrderT) => {
    handleSort();
    dispatch(setSortOrder(sortOrder));
  };
  return { handleSortBy, handleSortOrder, error };
};
