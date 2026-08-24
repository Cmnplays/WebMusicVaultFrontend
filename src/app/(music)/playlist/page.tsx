"use client";
import PlaylistList from "@/components/PlaylistPage/PlaylistList";
import PlaylistSkeleton from "@/components/PlaylistPage/PlaylistPageSkeleton";
import { getPlaylists } from "@/services/playlist.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import { setPlaylists } from "@/reduxSlices/song.slice";
import { ListMusic } from "lucide-react";

const Page = () => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const playlists = useAppSelector((state) => state.song.playlists);
  useEffect(() => {
    document.title = "Your Playlists | WmV";
    if (shouldFetchUser) return;

    // Don't refresh if we already have playlists in Redux
    if (
      playlists.defaultPlaylists.length > 0 ||
      playlists.personalPlaylists.length > 0
    ) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        setError(false);
        const data = await getPlaylists();
        dispatch(setPlaylists(data));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [
    shouldFetchUser,
    playlists.defaultPlaylists.length,
    playlists.personalPlaylists.length,
    dispatch,
    retryTick,
  ]);

  return (
    <>
      {loading ? (
        <PlaylistSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <ListMusic className="w-10 h-10 text-red-300/60" />
          <p className="text-red-300 text-sm">
            Couldn&apos;t load your playlists. Please check your connection and
            try again.
          </p>
          <button
            type="button"
            onClick={() => setRetryTick((t) => t + 1)}
            className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <PlaylistList playlists={playlists} />
      )}
    </>
  );
};

export default Page;
