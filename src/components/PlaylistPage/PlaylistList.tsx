"use client";
import { ListMusic } from "lucide-react";
import PlaylistCard from "@/components/PlaylistPage/PlaylistCard";
import type { PlaylistsResponse } from "@/services/playlist.services";

interface PlaylistListProps {
  playlists: PlaylistsResponse;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  const total =
    playlists.defaultPlaylists.length + playlists.personalPlaylists.length;

  return (
    <main className="max-w-5xl mx-auto min-h-screen p-4 text-white">
      <div className="flex items-center gap-3 mb-6">
        <ListMusic className="w-7 h-7 text-purple-300" />
        <h1 className="text-2xl font-bold tracking-tight">Your Playlists</h1>
        <span className="ml-auto text-sm text-purple-300">
          {total} playlists
        </span>
      </div>

      {/* Default playlists */}
      <div className="flex flex-col gap-3 mb-6">
        {playlists.defaultPlaylists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>

      {/* Personal playlists */}
      {playlists.personalPlaylists.length > 0 && (
        <>
          <p className="text-xs text-purple-300/60 uppercase tracking-widest mb-3">
            Your playlists
          </p>
          <div className="flex flex-col gap-3">
            {playlists.personalPlaylists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default PlaylistList;
