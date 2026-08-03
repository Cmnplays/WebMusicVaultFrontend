"use client";
import React, { useState } from "react";
import { Pin } from "lucide-react";
import type { Song } from "@/services/song.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { pinSong, unpinSong } from "@/reduxSlices/song.slice";
import {
  setAuthPromptString,
  setMountAuthPromptModal,
} from "@/reduxSlices/ui.slice";
import { showToast } from "@/hooks/useToast";
import { togglePinSong } from "@/services/song.services";

interface PinBtnProps {
  isPinned: boolean;
  song: Song;
  closeMoreOptionsModal: () => void;
}

const PinBtn: React.FC<PinBtnProps> = ({
  isPinned,
  song,
  closeMoreOptionsModal,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const pinnedSongs = useAppSelector((state) => state.song.pinnedSongs);
  const handleTogglePin = async () => {
    if (!accessToken) {
      closeMoreOptionsModal();
      dispatch(setAuthPromptString("pin"));
      dispatch(setMountAuthPromptModal(true));

      return;
    }
    if (pinnedSongs.length >= 3 && !isPinned) {
      showToast({
        message: "You can only pin up to 3 songs. Unpin one to add another.",
        type: "error",
      });
      return;
    }

    if (loading) return;

    const nextPinnedState = !isPinned;
    setLoading(true);

    if (nextPinnedState) {
      dispatch(pinSong(song));
    } else {
      dispatch(unpinSong(song._id));
    }

    try {
      const message = await togglePinSong(song._id, nextPinnedState);
      showToast({ message, type: "success" });
    } catch (err) {
      if (nextPinnedState) {
        dispatch(unpinSong(song._id));
      } else {
        dispatch(pinSong(song));
      }
      showToast({
        message: err instanceof Error ? err.message : "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
      closeMoreOptionsModal();
    }
  };

  return (
    <button
      type="button"
      onClick={handleTogglePin}
      disabled={loading}
      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-white/80 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Pin className="w-4 h-4" fill={isPinned ? "currentColor" : "none"} />
      {isPinned ? "Unpin song" : "Pin song"}
    </button>
  );
};

export default PinBtn;
