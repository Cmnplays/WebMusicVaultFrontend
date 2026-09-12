"use client";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  finishDownload,
  setDownloadProgress,
  startDownload,
} from "../reduxSlices/ui.slice";
import type { Song } from "@/services/song.services";
import { showToast } from "./useToast";

// Module-level singleton: only one download may be in flight at a time (all
// download buttons are disabled while `downloading` is true), but hook
// instances are created per call-site — so the in-flight controller lives
// here, not inside the hook. cancelActiveDownload() lets the progress card
// abort the running fetch.
let activeController: AbortController | null = null;

export const cancelActiveDownload = () => {
  activeController?.abort();
};

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
    const controller = new AbortController();
    activeController = controller;
    const title = targetSong.title.replace(/\.mp3$/i, "");

    try {
      dispatch(startDownload(targetSong.title));

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
      const res = await fetch(targetSong.fileUrl, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch");

      const total = Number(res.headers.get("content-length")) || 0;

      let blob: Blob;
      if (total > 0 && res.body) {
        // Stream the response so the progress card can show real progress.
        // Chunks are assembled into the same Blob `res.blob()` would have
        // produced — identical end result, plus a progress bar.
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        let lastReported = -1;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            const pct = Math.min(99, Math.floor((received / total) * 100));
            // Dispatch only on integer % changes — max ~100 renders per
            // download, so the progress bar stays cheap even on low-end.
            if (pct !== lastReported) {
              lastReported = pct;
              dispatch(setDownloadProgress(pct));
            }
          }
        }
        blob = new Blob(chunks as BlobPart[], {
          type: res.headers.get("content-type") ?? "audio/mpeg",
        });
      } else {
        // CDN didn't send Content-Length (or no streaming body available):
        // fall back to the plain buffered fetch. The progress card shows an
        // indeterminate bar instead of a percentage.
        dispatch(setDownloadProgress(0));
        blob = await res.blob();
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      // Derive the file extension from the URL Cloudinary actually serves
      // (e.g. ".../<publicId>.mp3?signature"), never hardcode it — if the
      // app ever supports other formats, downloads adapt automatically.
      const urlPath = targetSong.fileUrl.split("?")[0];
      const lastDot = urlPath.lastIndexOf(".");
      const ext = lastDot > -1 ? urlPath.slice(lastDot) : ".mp3";
      a.download = `${targetSong.title}${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      showToast({
        message: `Downloaded "${title}"`,
        type: "success",
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        // User-initiated cancel from the progress card — informational, not
        // an error.
        showToast({
          message: `Download of "${title}" cancelled`,
          type: "info",
        });
      } else {
        console.error(e);
        showToast({
          message: "Download failed. Please try again.",
          type: "error",
        });
      }
    } finally {
      if (activeController === controller) activeController = null;
      isInFlightRef.current = false;
      dispatch(finishDownload());
    }
  };
};
