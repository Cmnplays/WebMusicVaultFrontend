"use client";
import { ListMusic, Plus } from "lucide-react";
import PlaylistCard from "@/components/PlaylistPage/PlaylistCard";
import type { PlaylistsResponse } from "@/services/playlist.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setMountCreatePlaylistModal,
  setAuthPromptString,
  setMountAuthPromptModal,
} from "@/reduxSlices/ui.slice";

interface PlaylistListProps {
  playlists: PlaylistsResponse;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const total =
    playlists.defaultPlaylists.length + playlists.personalPlaylists.length;

  const handleCreateClick = () => {
    if (!accessToken) {
      dispatch(setAuthPromptString("create playlists"));
      dispatch(setMountAuthPromptModal(true));
      return;
    }
    dispatch(setMountCreatePlaylistModal(true));
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <ListMusic className="w-7 h-7 text-purple-300" />
        <h1 className="text-2xl font-bold tracking-tight">Your Playlists</h1>
        <span className="ml-auto text-sm text-purple-300">
          {total} playlists
        </span>
        <button
          type="button"
          onClick={handleCreateClick}
          aria-label="Create new playlist"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 active:scale-[0.98] transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Playlist
        </button>
      </div>

      {/* Default playlists */}
      <p className="text-xs text-purple-300/60 uppercase tracking-widest mb-3">
            Default playlists
          </p>
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
    </>
  );
};

export default PlaylistList;
