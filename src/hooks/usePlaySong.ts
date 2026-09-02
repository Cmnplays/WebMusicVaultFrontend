"use client";
import { useAppDispatch, useAppSelector } from "../store/hook";
import type { Song } from "../services/song.services";
import {
  setPlaying,
  setPlayingSong,
  setMiniPanelOpen,
  setPlayNextContext,
} from "../reduxSlices/player.slice";
import type { playNextContextType } from "../reduxSlices/player.slice";

export const usePlaySong = () => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const playing = useAppSelector((state) => state.player.playing);
  const miniPanelOpen = useAppSelector((state) => state.player.miniPanelOpen);
  const songsType = useAppSelector((state) => state.song.songsType);

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
      // If the queue belongs to a different context (page), reset it so
      // Play Next follows the newly playing song's context.
      dispatch(setPlayNextContext(songsType as playNextContextType));
      if (!miniPanelOpen) {
        dispatch(setMiniPanelOpen(true));
      }
      dispatch(setPlayingSong(song));
      dispatch(setPlaying(true));
    }
  };

  return { handlePlayClick };
};
