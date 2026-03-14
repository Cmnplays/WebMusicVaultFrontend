// PlaylistList.tsx
"use client";
import { ListMusic } from "lucide-react";
import PlaylistCard from "@/components/PlaylistPage/PlaylistCard";
import type { Playlist } from "@/services/playlist.services";
interface PlaylistListProps {
  playlists: Playlist[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  return (
    <main className="max-w-5xl mx-auto min-h-screen p-4 text-white">
      <div className="flex items-center gap-3 mb-6">
        <ListMusic className="w-7 h-7 text-purple-300" />
        <h1 className="text-2xl font-bold tracking-tight">Your Playlists</h1>
        <span className="ml-auto text-sm text-purple-300">
          {playlists.length} playlists
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>
    </main>
  );
};

export default PlaylistList;
