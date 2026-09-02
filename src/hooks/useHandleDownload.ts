"use client";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setDownloading } from "../reduxSlices/ui.slice";
import type { Song } from "@/services/song.services";
import { showToast } from "./useToast";

export const useHandleDownload = (song?: Song) => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const targetSong = song ?? playingSong;
  // Guards against double-clicks that land within the same tick / before
  // Redux re-renders with `downloading: true` (e.g. the confirmation modal's
  // "Yes" button stays clickable during its ~0.3s exit animation).
  const isInFlightRef = useRef(false);

  return async () => {
    if (isInFlightRef.current) return;

    if (!targetSong || !targetSong.fileUrl) {
      showToast({ message: "No song available to download.", type: "error" });
      return;
    }

    isInFlightRef.current = true;

    try {
      dispatch(setDownloading(true));

      // Download directly from the song's fileUrl (already signed and valid,
      // no re-fetch needed — signed CDN URLs don't expire on a timer).
      //
      // Intentional design note: we download via the general streaming URL
      // (attachment: false) and force the download client-side with blob +
      // anchor, NOT via an attachment: true endpoint. Reasons:
      // - attachment only affects server-sent Content-Disposition, which is
      //   a no-op when the response is consumed via fetch() anyway.
      // - Signed URLs are private (require the API secret to mint), so
      //   sharing direct links outside the app isn't a supported use case.
      // - The blob step preserves client-side filename control (a.download),
      //   the success/error toast, and the `downloading` UI state, none of
      //   which a plain browser navigation could provide.
      const downloadUrl = targetSong.fileUrl;

      const res = await fetch(downloadUrl);
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
      isInFlightRef.current = false;
      dispatch(setDownloading(false));
    }
  };
};
