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

const MAX_PLAYLISTS = 10;

interface PlaylistListProps {
  playlists: PlaylistsResponse;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const total =
    playlists.defaultPlaylists.length + playlists.personalPlaylists.length;
  const personalCount = playlists.personalPlaylists.filter(
    (p) => !p.isDefault,
  ).length;
  const atCap = personalCount >= MAX_PLAYLISTS;

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
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-600/25 border border-white/10 flex items-center justify-center shrink-0">
              <ListMusic className="w-5 h-5 text-purple-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
              Your Playlists
            </h1>
          </div>

          <button
            type="button"
            onClick={handleCreateClick}
            disabled={atCap}
            title={
              atCap
                ? "Playlist limit reached (10). Delete one to create another."
                : undefined
            }
            aria-label="Create new playlist"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 active:scale-[0.98] transition-all shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        {/* Meta row */}
        <div className="mt-2 pl-[52px] flex items-center gap-2 text-xs text-purple-300/70">
          <span>{total} total</span>
          <span className="text-white/20">•</span>
          <span
            className={atCap ? "text-red-300 font-medium" : ""}
            title="Personal playlists you can create"
          >
            {personalCount} / {MAX_PLAYLISTS} personal
          </span>
          {atCap && (
            <span className="text-red-300/80">(limit reached)</span>
          )}
        </div>
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
