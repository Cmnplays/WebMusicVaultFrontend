"use client";
import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  setTriggerFetch,
  setTempTriggerFetch,
} from "../reduxSlices/song/songSlice";
import {} from "@/reduxSlices/player/playerSlice";
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
  const dispatch = useAppDispatch();
  const firstIntersectionDone = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (!firstIntersectionDone.current) {
        firstIntersectionDone.current = true;
        return;
      }
      if (target.isIntersecting) {
        if (loading) {
          return;
        }
        if (isTemp) {
          if (!tempHasMoreSongs) return;
          dispatch(setTempTriggerFetch());
          return;
        }
        if (!hasMoreSongs) return;
        dispatch(setTriggerFetch());
      }
    });
    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, []);
};

export default useInfiniteScroll;
