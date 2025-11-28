import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  setTriggerFetch,
  settempTriggerFetch,
} from "../reduxSlices/song/songSlice";
const useInfiniteScroll = ({
  isTemp = false,
  sentinelRef,
}: {
  isTemp?: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const loading = useAppSelector((state) => state.song.loading);
  const hasMoreSongs = useAppSelector((state) => state.song.hasMoreSongs);
  const tempHasMoreSongs = useAppSelector(
    (state) => state.song.tempHasMoreSongs
  );
  const dispatch = useAppDispatch();
  const firstIntersectionDone = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (!firstIntersectionDone.current) {
        firstIntersectionDone.current = true;
        return;
      }
      if (target.isIntersecting) {
        console.log("intersected");
        if (loading) {
          return;
        }
        if (isTemp) {
          if (!tempHasMoreSongs) return;
          dispatch(settempTriggerFetch());
          return;
        }
        if (!hasMoreSongs) return;
        console.log("fetched");
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
