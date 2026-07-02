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
        console.log("entered observer");
        console.log({ notintersecting: !entry.isIntersecting, loading });
        if (!entry.isIntersecting || loading) return;
        console.log("passed observer lvl 1 ");

        if (isTemp) {
          console.log("passed observer lvl 2 ");
          if (!tempHasMoreSongs || tempSongs.length === 0) return;
          console.log("passed observer lvl 3 ");
          dispatch(setTempTriggerFetch());
          console.log("worked");
          return;
        }
        console.log("passed observer lvl 2 but skipped is temp");
        if (!hasMoreSongs || songs.length === 0) return;
        dispatch(setTriggerFetch());
        console.log("worked but outside tempm case");
      },
      { rootMargin: "300px" },
    );

    const sentinel = sentinelRef.current;

    if (sentinel) {
      observer.observe(sentinel);
    }

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
