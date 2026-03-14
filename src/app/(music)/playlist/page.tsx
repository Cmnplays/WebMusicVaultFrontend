"use client";
import PlaylistList from "@/components/PlaylistPage/PlaylistList";
import { getPlaylists } from "@/services/playlist.services";
import { useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import type { Playlist } from "@/services/playlist.services";

const Page = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  useEffect(() => {
    const init = async () => {
      const playlists = await getPlaylists();
      console.log(playlists);
      setPlaylists(playlists);
    };
    init();
  }, [accessToken]);

  return (
    <div>
      <PlaylistList playlists={playlists}></PlaylistList>
    </div>
  );
};

export default Page;
