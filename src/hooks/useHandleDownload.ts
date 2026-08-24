"use client";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setDownloading } from "../reduxSlices/ui.slice";
import type { Song } from "@/services/song.services";
import { showToast } from "./useToast";
export const useHandleDownload = (song?: Song) => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const targetSong = song ?? playingSong;

  return async () => {
    if (!targetSong || !targetSong.fileUrl) {
      showToast({ message: "No song available to download.", type: "error" });
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
      showToast({
        message: `Downloaded "${targetSong.title.replace(/\.mp3$/i, "")}"`,
        type: "success",
      });
    } catch (e) {
      console.error(e);
      showToast({
        message: "Download failed. Please try again.",
        type: "error",
      });
    } finally {
      dispatch(setDownloading(false));
    }
  };
};
