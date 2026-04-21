"use client";
import PlaylistList from "@/components/PlaylistPage/PlaylistList";
import PlaylistSkeleton from "@/components/PlaylistPage/PlaylistPageSkeleton";
import { getPlaylists } from "@/services/playlist.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import { setPlaylists } from "@/reduxSlices/song/songSlice";

const Page = () => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const [loading, setLoading] = useState(true);
  const playlists = useAppSelector((state) => state.song.playlists);
  useEffect(() => {
    if (shouldFetchUser) return;
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
  }, [shouldFetchUser]);

  return (
    <>
      {loading ? <PlaylistSkeleton /> : <PlaylistList playlists={playlists} />}
    </>
  );
};

export default Page;
