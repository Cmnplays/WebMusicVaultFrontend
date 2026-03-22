// PlaylistCard.tsx
"use client";
import { useRouter } from "next/navigation";
import { ListMusic, Music2, User } from "lucide-react";
import type { Playlist } from "@/services/playlist.services";

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        const route = playlist.isDefault
          ? `/liked-songs/${playlist._id}`
          : `/playlist/${playlist._id}`;
        router.push(route);
      }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#6b30c2]/40 border border-white/10 hover:bg-[#6b30c2]/60 hover:border-purple-400/30 transition-all cursor-pointer group"
    >
      <div className="w-11 h-11 rounded-lg bg-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-500 transition-colors">
        <ListMusic className="w-5 h-5 text-white" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-white truncate">
          {playlist.name}
        </span>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-purple-300">
            <User className="w-3 h-3" />
            {playlist.owner.username}
          </span>
          <span className="flex items-center gap-1 text-xs text-purple-300">
            <Music2 className="w-3 h-3" />
            {playlist.songs} songs
          </span>
        </div>
      </div>

      <span className="text-purple-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </span>
    </div>
  );
};

export default PlaylistCard;
