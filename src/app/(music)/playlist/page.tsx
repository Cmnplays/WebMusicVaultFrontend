"use client";
import PlaylistList from "@/components/PlaylistPage/PlaylistList";
import { getPlaylists } from "@/services/playlist.services";
import { useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import type { Playlist } from "@/services/playlist.services";
const mockPlaylists = [
  {
    _id: "1",
    name: "My Favourites",
    owner: "aaditya",
    songs: ["s1", "s2", "s3", "s4", "s5"],
  },
  { _id: "2", name: "Late Night Vibes", owner: "aaditya", songs: ["s1", "s2"] },
  {
    _id: "3",
    name: "Workout Mix",
    owner: "john",
    songs: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"],
  },
];
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
