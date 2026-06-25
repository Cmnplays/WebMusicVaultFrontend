"use client";
import { useAppDispatch, useAppSelector } from "../store/hook";
import type { Song } from "../services/song.services";
import {
  setPlaying,
  setPlayingSong,
  setMiniPanelOpen,
} from "../reduxSlices/player.slice";

export const usePlaySong = () => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const playing = useAppSelector((state) => state.player.playing);
  const miniPanelOpen = useAppSelector((state) => state.player.miniPanelOpen);

  const handlePlayClick = (song: Song) => {
    if (playingSong?._id === song._id) {
      if (playing) {
        // Stop and hide as requested
        dispatch(setPlaying(false));
        dispatch(setMiniPanelOpen(false));
      } else {
        // Resume and show
        dispatch(setPlaying(true));
        if (!miniPanelOpen) {
          dispatch(setMiniPanelOpen(true));
        }
      }
    } else {
      // Play new song
      if (!miniPanelOpen) {
        dispatch(setMiniPanelOpen(true));
      }
      dispatch(setPlayingSong(song));
      dispatch(setPlaying(true));
    }
  };

  return { handlePlayClick };
};
