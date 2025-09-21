import { useState, useEffect } from "react";
import { fetchAllSongs } from "../services/song.services";
import type { Song } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import axios from "axios";
import {
  setSongs,
  setStatusText,
  setLoading,
  handleSortByChange,
  setSortChanged,
} from "../reduxSlices/song/songSlice";

export const useSearchSongs = () => {
  const dispatch = useAppDispatch();
  const [hasMoreSongs, setHasMoreSongs] = useState(true);

  const songs = useAppSelector((state) => state.song.songs);
  const sortChanged = useAppSelector((state) => state.song.sortChanged);
  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const page = useAppSelector((state) => state.song.page);
  const Limit = 10;
  const [error, setError] = useState(false);

  // Fetch songs on page or initial load
  useEffect(() => {
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
          setHasMoreSongs(false);
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

    // Prevent refetch if songs already exist and sort order hasn't changed
    if (songs.length === 0 || songs.length < page * Limit || sortChanged) {
      loadSongs();
      return;
    }
  }, [page, sortOrder, dispatch, songs, sortChanged, setError]);

  return { error, hasMoreSongs };
};
