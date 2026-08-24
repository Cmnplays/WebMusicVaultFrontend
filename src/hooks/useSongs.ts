"use client";
import { useState, useEffect, useRef } from "react";
import { getPinnedSongs, getSongs } from "../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
import { useAppDispatch, useAppSelector } from "../store/hook";
import axios from "axios";
import {
  setSongs,
  replaceSongs,
  handleSortByChange,
  setSortChanged,
  setHasMoreSongs,
  setNextCursor,
  setPinnedSongs,
} from "../reduxSlices/song.slice";
import { setStatusText, setLoading } from "@/reduxSlices/ui.slice";

// Module-level flag: persists across page navigation (hook unmount/remount)
// for the whole SPA session, unlike useRef which resets on remount.
let pinnedFetchedThisSession = false;

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
  const pinnedSongs = useAppSelector((state) => state.song.pinnedSongs);
  const didMount = useRef(false);
  const nextCursorRef = useRef(nextCursor);
  const songsLengthRef = useRef(songs.length);
  // Pinned-songs sync ref (mirrors Redux so closures always read fresh value)
  const pinnedRef = useRef(pinnedSongs);

  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  useEffect(() => {
    songsLengthRef.current = songs.length;
  }, [songs.length]);

  useEffect(() => {
    pinnedRef.current = pinnedSongs;
  }, [pinnedSongs]);

  useEffect(() => {
    const loadSongs = async () => {
      // Don't fetch songs until initial auth check has completed
      if (shouldFetchUser) {
        // Session boundary (app boot / logout): force a fresh pinned fetch
        // on the next login so we never show another user's pins.
        pinnedFetchedThisSession = false;
        return;
      }
      if (!didMount.current && songsLengthRef.current > 0) {
        didMount.current = true;
        return; // skip only first mount
      }
      didMount.current = true;
      dispatch(setLoading(true));
      try {
        setError(false);
        if (!nextCursorRef.current) {
          if (sortOrder === "asc") {
            dispatch(setStatusText("Fetching songs... Newest to Oldest."));
          } else {
            dispatch(setStatusText("Fetching songs... Oldest to Newest."));
          }
        } else {
          dispatch(setStatusText("Loading more songs..."));
        }
        const response = await getSongs({
          sortBy,
          sortOrder,
          cursor: nextCursorRef.current,
        });

        // Fetch pinned songs only once per SESSION (module flag survives page
        // navigation); afterwards reuse Redux state (pin/unpin actions keep
        // it in sync) instead of re-requesting /song/pinned.
        let effectivePinned = pinnedRef.current;
        if (!pinnedFetchedThisSession) {
          effectivePinned = await getPinnedSongs();
          pinnedFetchedThisSession = true;
          dispatch(setPinnedSongs(effectivePinned));
        }

        const newSongs = [...effectivePinned, ...response.songs];

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
  }, [triggerFetch, sortBy, sortOrder, sortChanged, dispatch, shouldFetchUser]);

  useEffect(() => {
    if (songs.length === 0 && pinnedSongs.length === 0) return;

    const pinnedIds = new Set(pinnedSongs.map((song) => song._id));
    const currentPinnedOrder = songs.filter((song) => pinnedIds.has(song._id));
    const remainingSongs = songs.filter((song) => !pinnedIds.has(song._id));

    const orderedPinnedSongs = pinnedSongs.map((song) => {
      const existing = currentPinnedOrder.find((s) => s._id === song._id);
      return existing ?? song;
    });

    const needsUpdate =
      orderedPinnedSongs.length !== currentPinnedOrder.length ||
      orderedPinnedSongs.some(
        (song, index) => song._id !== currentPinnedOrder[index]?._id,
      );

    if (!needsUpdate) return;

    dispatch(replaceSongs([...orderedPinnedSongs, ...remainingSongs]));
  }, [dispatch, pinnedSongs, songs]);

  return { error };
};
