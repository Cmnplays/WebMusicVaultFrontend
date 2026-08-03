import React from "react";
import type { Song } from "@/services/song.services";
import { Pencil } from "lucide-react";
import PinBtn from "../SongList/PinBtn";
import AddToPlaylistBtn from "../SongList/AddToPlaylistBtn";

interface SongCardMoreOptionsModalProps {
  song: Song;
  isAdmin: boolean;
  isPinned: boolean;
  handleEditSong: (song: Song) => void;
  onClose: () => void;
}

const SongCardMoreOptionsModal: React.FC<SongCardMoreOptionsModalProps> = ({
  song,
  isAdmin,
  isPinned,
  handleEditSong,
  onClose,
}) => {
  return (
    <div
      className="
        absolute right-0 top-full mt-2
        w-52 overflow-hidden rounded-xl
        border border-white/10
        bg-neutral-900/95 backdrop-blur-xl
        shadow-2xl shadow-black/40
        z-50
        animate-in fade-in zoom-in-95 duration-150
      "
    >
      <div className="py-1">
        <PinBtn
          isPinned={isPinned}
          song={song}
          closeMoreOptionsModal={onClose}
        />

        <AddToPlaylistBtn song={song} closeMoreOptionsModal={onClose} />

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              handleEditSong(song);
              onClose();
            }}
            className="
              flex w-full items-center gap-3
              px-4 py-3
              text-sm font-medium text-white/80
              transition-all duration-150
              hover:bg-white/10
              hover:text-white
              active:scale-[0.98]
              focus:outline-none
              focus:bg-white/10
            "
          >
            <Pencil className="h-4 w-4 shrink-0" />
            <span>Edit song</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCardMoreOptionsModal;
