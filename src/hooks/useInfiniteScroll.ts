"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  setTriggerFetch,
  setTempTriggerFetch,
} from "../reduxSlices/song.slice";

const useInfiniteScroll = ({
  isTemp = false,
  sentinelRef,
}: {
  isTemp?: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const loading = useAppSelector((state) => state.ui.loading);
  const hasMoreSongs = useAppSelector((state) => state.song.hasMoreSongs);
  const tempHasMoreSongs = useAppSelector(
    (state) => state.song.tempHasMoreSongs,
  );
  const songs = useAppSelector((state) => state.song.songs);
  const tempSongs = useAppSelector((state) => state.song.tempSongs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loading) return;

        if (isTemp) {
          if (!tempHasMoreSongs || tempSongs.length === 0) return;
          dispatch(setTempTriggerFetch());
          return;
        }
        if (!hasMoreSongs || songs.length === 0) return;
        dispatch(setTriggerFetch());
      },
      { rootMargin: "300px" },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [
    loading,
    isTemp,
    hasMoreSongs,
    tempHasMoreSongs,
    songs.length,
    tempSongs.length,
    dispatch,
    sentinelRef,
  ]);
};

export default useInfiniteScroll;
