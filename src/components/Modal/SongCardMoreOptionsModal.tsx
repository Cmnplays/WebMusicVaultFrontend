import React from "react";
import type { Song } from "@/services/song.services";
import { Pencil, Trash, Download, ListStart, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import PinBtn from "../SongList/PinBtn";
import AddToPlaylistBtn from "../SongList/AddToPlaylistBtn";
import RemoveFromPlaylistBtn from "../SongList/RemoveFromPlaylistBtn";
import { showToast } from "@/hooks/useToast";
import {
  setActionSong,
  setMountDeleteConfirmation,
  setMountDownloadConfirmation,
} from "@/reduxSlices/ui.slice";
import {
  addToPlayNext,
  clearPlayNext,
  MAX_UP_NEXT_QUEUE_SIZE,
} from "@/reduxSlices/player.slice";

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
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const upNextQueue = useAppSelector((state) => state.player.upNextQueue);
  const downloading = useAppSelector((state) => state.ui.downloading);

  const handleDownloadClick = () => {
    dispatch(setActionSong(song));
    dispatch(setMountDownloadConfirmation(true));
    onClose();
  };

  // "Play Next" — the reducer enforces the same invariants; the checks here
  // exist to give the user feedback (or a deliberate silent no-op).
  const handlePlayNextClick = () => {
    onClose();
    if (playingSong?._id === song._id) return; // no-op for the playing song
    if (upNextQueue.some((s) => s._id === song._id)) return; // already queued: ignore
    if (upNextQueue.length >= MAX_UP_NEXT_QUEUE_SIZE) {
      showToast({ message: "Queue is full", type: "info" });
      return;
    }
    dispatch(addToPlayNext(song));
    showToast({
      message: `Playing "${song.title.replace(/\.mp3$/i, "")}" next`,
      type: "success",
    });
  };

  const handleDeleteClick = () => {
    dispatch(setActionSong(song));
    dispatch(setMountDeleteConfirmation(true));
    onClose();
  };

  return (
    <div
      className="
        absolute right-0 top-full mt-2
        w-52 overflow-hidden rounded-xl
        border border-white/10
        bg-neutral-900/95 backdrop-blur-xl
        shadow-2xl shadow-black/40
        z-200
        animate-in fade-in zoom-in-95 duration-150
      "
    >
      <div className="py-1">
        <button
          type="button"
          onClick={handlePlayNextClick}
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
          <ListStart className="h-4 w-4 shrink-0" />
          <span>Play next · {upNextQueue.length}/{MAX_UP_NEXT_QUEUE_SIZE}</span>
        </button>

        {upNextQueue.length > 0 && (
          <button
            type="button"
            onClick={() => {
              dispatch(clearPlayNext());
              onClose();
              showToast({ message: "Queue cleared", type: "success" });
            }}
            className="
              flex w-full items-center gap-3
              px-4 py-3
              text-sm font-medium text-red-400/80
              transition-all duration-150
              hover:bg-white/10
              hover:text-red-400
              active:scale-[0.98]
              focus:outline-none
              focus:bg-white/10
            "
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            <span>Clear Queue</span>
          </button>
        )}

        <PinBtn
          isPinned={isPinned}
          song={song}
          closeMoreOptionsModal={onClose}
        />

        <AddToPlaylistBtn song={song} closeMoreOptionsModal={onClose} />

        <RemoveFromPlaylistBtn song={song} closeMoreOptionsModal={onClose} />

        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={downloading}
          title={
            downloading ? "A download is already in progress" : undefined
          }
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
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          <Download className="h-4 w-4 shrink-0" />
          <span>Download song</span>
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
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
          <Trash className="h-4 w-4 shrink-0" />
          <span>Delete song</span>
        </button>

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
