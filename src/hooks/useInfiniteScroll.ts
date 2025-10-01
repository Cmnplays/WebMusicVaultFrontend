import { useAppDispatch } from "../store/hook";
import { useAppSelector } from "../store/hook";
import { useEffect } from "react";
export function useInfiniteScroll({
  hasMoreSongs,
  setPage,
  page,
}: {
  hasMoreSongs: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.song.loading);

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (loading || !hasMoreSongs) return;

      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const bottomPosition = document.documentElement.offsetHeight;

        if (bottomPosition - scrollPosition < 150) {
          setPage(page + 1);
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [loading, hasMoreSongs, dispatch, page, setPage]);
}
