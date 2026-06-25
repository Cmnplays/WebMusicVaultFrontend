"use client";
import PlaylistList from "@/components/PlaylistPage/PlaylistList";
import PlaylistSkeleton from "@/components/PlaylistPage/PlaylistPageSkeleton";
import { getPlaylists } from "@/services/playlist.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import { setPlaylists } from "@/reduxSlices/song/song.slice";

const Page = () => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const [loading, setLoading] = useState(true);
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
        const data = await getPlaylists();
        dispatch(setPlaylists(data));
      } catch (err) {
        console.error(err);
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
  ]);

  return (
    <>
      {loading ? <PlaylistSkeleton /> : <PlaylistList playlists={playlists} />}
    </>
  );
};

export default Page;
