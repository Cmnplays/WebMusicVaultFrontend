"use client";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setDownloading } from "../reduxSlices/ui.slice";
export const useHandleDownload = () => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);

  return async () => {
    try {
      dispatch(setDownloading(true));

      const res = await fetch(playingSong!.fileUrl!);
      if (!res.ok) throw new Error("Failed to fetch");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = playingSong!.title!;
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
