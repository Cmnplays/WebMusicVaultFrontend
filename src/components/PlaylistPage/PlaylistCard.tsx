// PlaylistCard.tsx
"use client";
import { useRouter } from "next/navigation";
import { ListMusic, Music2, Pencil, User } from "lucide-react";
import type { Playlist } from "@/services/playlist.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setMountEditPlaylistModal,
  setActionPlaylist,
  setAuthPromptString,
  setMountAuthPromptModal,
} from "@/reduxSlices/ui.slice";

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleOpen = () => {
    const route = playlist.isDefault
      ? `/liked-songs/${playlist._id}`
      : `/playlist/${playlist._id}`;
    router.push(route);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!accessToken) {
      dispatch(setAuthPromptString("edit playlists"));
      dispatch(setMountAuthPromptModal(true));
      return;
    }
    dispatch(setActionPlaylist(playlist));
    dispatch(setMountEditPlaylistModal(true));
  };

  return (
    <div className="relative w-full rounded-xl bg-[#6b30c2]/40 border border-white/10 hover:bg-[#6b30c2]/60 hover:border-purple-400/30 transition-all cursor-pointer group">
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Open playlist: ${playlist.name}`}
        className={`w-full text-left flex items-center gap-4 px-4 py-3 ${
          playlist.isDefault ? "" : "pr-14"
        }`}
      >
        <div className="w-11 h-11 rounded-lg bg-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-500 transition-colors">
          <ListMusic className="w-5 h-5 text-white" aria-hidden="true" />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold text-white truncate">
            {playlist.name}
          </span>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-purple-300">
              <User className="w-3 h-3" aria-hidden="true" />
              {playlist.owner.username}
            </span>
            <span className="flex items-center gap-1 text-xs text-purple-300">
              <Music2 className="w-3 h-3" aria-hidden="true" />
              {playlist.songs} songs
            </span>
          </div>
        </div>

        {/* The edit pencil owns the top-right corner on personal playlists,
            so the hover chevron only appears on default playlists where it
            can never collide with it. */}
        {playlist.isDefault && (
          <span
            className="text-purple-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            →
          </span>
        )}
      </button>

      {!playlist.isDefault && (
        <button
          type="button"
          onClick={handleEditClick}
          aria-label={`Edit playlist: ${playlist.name}`}
          title="Edit playlist"
          className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-purple-200/80 hover:text-white hover:bg-purple-600/40 transition-all shrink-0"
        >
          <Pencil className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default PlaylistCard;
