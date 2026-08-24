"use client";

import React from "react";
import type { Song } from "@/services/song.services";
import { ListPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setActionSong,
  setAuthPromptString,
  setMountAddToPlaylistModal,
  setMountAuthPromptModal,
} from "@/reduxSlices/ui.slice";

interface AddToPlaylistBtnProps {
  song: Song;
  closeMoreOptionsModal: () => void;
}

const AddToPlaylistBtn: React.FC<AddToPlaylistBtnProps> = ({
  song,
  closeMoreOptionsModal,
}) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleClick = () => {
    closeMoreOptionsModal();
    if (!accessToken) {
      dispatch(setAuthPromptString("add songs to playlists"));
      dispatch(setMountAuthPromptModal(true));
      return;
    }
    dispatch(setActionSong(song));
    dispatch(setMountAddToPlaylistModal(true));
  };
  return (
    <button
      type="button"
      onClick={handleClick}
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
      <ListPlus className="h-4 w-4 shrink-0" />
      <span>Add to playlist</span>
    </button>
  );
};

export default AddToPlaylistBtn;
