import React, { useState, useEffect, useRef } from "react";
import { fetchAllSongs } from "../services/song.services";
import type { songsReturnType } from "../services/song.services";
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
  setSortOrder,
  setHasMoreSongs,
  setNextCursor,
} from "../reduxSlices/song/songSlice";

export const useSongs = (panelRef: React.RefObject<HTMLDivElement | null>) => {
  const dispatch = useAppDispatch();
  const sortChanged = useAppSelector((state) => state.song.sortChanged);
  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const [error, setError] = useState(false);
  const triggerFetch = useAppSelector((state) => state.song.triggerFetch);
  const nextCursor = useAppSelector((state) => state.song.nextCursor);
  const songs = useAppSelector((state) => state.song.songs);
  const didMount = useRef(false);

  useEffect(() => {
    const loadSongs = async () => {
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
            dispatch(
              setStatusText(
                "Fetching songs... Newest to Oldest.\n(First load may take up to a minute as the server wakes up)"
              )
            );
          } else {
            dispatch(
              setStatusText(
                "Fetching songs... Oldest to Newest.\n(First load may take up to a minute as the server wakes up)"
              )
            );
          }
        } else {
          dispatch(setStatusText("Loading more songs..."));
        }
        console.log(triggerFetch, sortOrder, sortChanged);
        const response: songsReturnType = await fetchAllSongs({
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
  }, [triggerFetch, sortOrder, sortChanged, dispatch]);

  const handleSorting = () => {
    dispatch(setSortChanged(true));
    dispatch(setSongs([]));
    dispatch(setNextCursor(undefined));
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

  return { handleSorting, error };
};
