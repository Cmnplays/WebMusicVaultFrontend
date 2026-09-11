"use client";
import React, { useState } from "react";
import { ListMinus, Loader2 } from "lucide-react";
import type { Song } from "@/services/song.services";
import { useAppDispatch } from "@/store/hook";
import {
  decrementPlaylistSongCount,
  deleteTempSong,
} from "@/reduxSlices/song.slice";
import { removeSongs } from "@/services/playlist.services";
import { showToast } from "@/hooks/useToast";
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import { usePathname, useParams } from "next/navigation";

interface RemoveFromPlaylistBtnProps {
  song: Song;
  closeMoreOptionsModal: () => void;
}

const RemoveFromPlaylistBtn: React.FC<RemoveFromPlaylistBtnProps> = ({
  song,
  closeMoreOptionsModal,
}) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const params = useParams();
  const [removing, setRemoving] = useState(false);

  const playlistId = params?.id as string | undefined;
  const isPlaylistPage = pathname?.startsWith("/playlist/") && !!playlistId;

  if (!isPlaylistPage) return null;

  const handleRemove = async () => {
    if (removing || !playlistId) return;
    setRemoving(true);
    closeMoreOptionsModal();
    try {
      await removeSongs(playlistId, [song._id]);
      dispatch(deleteTempSong(song._id));
      dispatch(decrementPlaylistSongCount(playlistId));
      showToast({
        message: `Removed "${song.title}" from playlist`,
        type: "success",
      });
    } catch (err) {
      const message = getApiErrorMessage(err);
      if (message) {
        showToast({
          message,
          type: "error",
        });
      }
    } finally {
      setRemoving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={removing}
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
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {removing ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <ListMinus className="h-4 w-4 shrink-0" />
      )}
      <span>Remove from playlist</span>
    </button>
  );
};

export default RemoveFromPlaylistBtn;