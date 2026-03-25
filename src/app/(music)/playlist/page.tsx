"use client";
import PlaylistList from "@/components/PlaylistPage/PlaylistList";
import PlaylistSkeleton from "@/components/PlaylistPage/PlaylistPageSkeleton";
import { getPlaylists } from "@/services/playlist.services";
import { useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import type { PlaylistsResponse } from "@/services/playlist.services";
import ProtectedLayout from "@/components/ProtectedLayout";

const Page = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<PlaylistsResponse>({
    defaultPlaylists: [],
    personalPlaylists: [],
  });

  useEffect(() => {
    if (!accessToken) return;
    const init = async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [accessToken]);

  return (
    <ProtectedLayout skeleton={<PlaylistSkeleton />}>
      <PlaylistList playlists={playlists} />
    </ProtectedLayout>
  );
};

export default Page;
