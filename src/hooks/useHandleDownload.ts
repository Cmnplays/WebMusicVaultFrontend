"use client";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setDownloading } from "../reduxSlices/ui.slice";
import type { Song } from "@/services/song.services";
export const useHandleDownload = (song?: Song) => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const targetSong = song ?? playingSong;

  return async () => {
    if (!targetSong || !targetSong.fileUrl) {
      console.error("No song available to download");
      return;
    }

    try {
      dispatch(setDownloading(true));

      const res = await fetch(targetSong.fileUrl);
      if (!res.ok) throw new Error("Failed to fetch");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = targetSong.title;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setDownloading(false));
    }
  };
};
