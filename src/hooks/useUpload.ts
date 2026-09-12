"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { uploadSong } from "@/services/song.services";
import { showToast } from "./useToast";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "done"
  | "error"
  | "exists"
  | "cancelled";

export interface SongEntry {
  id: string;
  file: File;
  title: string;
  artist: string;
  coverImage?: File;
  status: UploadStatus;
  error?: string;
}

export function useUpload() {
  const [songs, setSongs] = useState<SongEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  // Synchronous "is an upload in flight?" flag — read directly in the
  // unmount cleanup below. State (isRunning) can't be used for this: its
  // value inside the cleanup closure is stale at the moment of unmount.
  const isUploadingRef = useRef(false);

  // Cancel any in-flight upload when the user leaves the upload page. The
  // request would otherwise keep running in the background (wasting
  // bandwidth and backend resources for an upload whose owner is gone).
  // The toast only fires when an upload was ACTUALLY in progress — an idle
  // visit to the page never triggers it.
  useEffect(() => {
    return () => {
      if (isUploadingRef.current) {
        abortRef.current?.abort();
        showToast({
          message: "Upload cancelled — you left the page.",
          type: "info",
        });
      }
    };
  }, []);
  const songsRef = useRef<SongEntry[]>([]); // 👈 always fresh

  // keep ref in sync
  const updateSongs = (updater: (prev: SongEntry[]) => SongEntry[]) => {
    setSongs((prev) => {
      const next = updater(prev);
      songsRef.current = next;
      return next;
    });
  };

  const addFiles = useCallback((files: File[]) => {
    // lastModified isn't populated consistently across browsers (Firefox may
    // leave it undefined) — normalize it so a re-pick of the same file always
    // dedupes regardless of browser.
    const fileKey = (f: File) => `${f.name}|${f.size}|${f.lastModified ?? ""}`;
    const existing = new Set(songsRef.current.map((s) => fileKey(s.file)));
    const unseen = files.filter((file) => {
      const key = fileKey(file);
      if (existing.has(key)) return false;
      existing.add(key);
      return true;
    });
    const skipped = files.length - unseen.length;
    if (!unseen.length && skipped > 0) {
      // Every picked file is already in the queue — give visible feedback
      // instead of silently doing nothing (previously this looked like a
      // dead dropzone).
      showToast({
        message:
          skipped === 1
            ? "Song already in your upload queue"
            : `${skipped} songs are already in your upload queue`,
        type: "info",
      });
      return;
    }
    if (skipped > 0) {
      // Mixed batch: add the new ones, tell the user what was skipped.
      showToast({
        message: `${skipped} already in queue — added ${unseen.length} new`,
        type: "info",
      });
    }
    const newEntries: SongEntry[] = unseen.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      title: file.name.replace(/\.[^.]+$/, ""),
      artist: "",
      status: "idle",
    }));
    updateSongs((prev) => [...prev, ...newEntries].slice(0, 10));
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<SongEntry>) => {
    updateSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }, []);

  const removeEntry = useCallback((id: string) => {
    updateSongs((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setStatus = (id: string, status: UploadStatus, error?: string) => {
    updateSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, error } : s)),
    );
  };

  const startUpload = useCallback(async () => {
    const pending = songsRef.current.filter((s) => s.status === "idle");
    if (!pending.length || isRunning) return;

    const controller = new AbortController();
    abortRef.current = controller;
    isUploadingRef.current = true;
    setIsRunning(true);

    for (const entry of pending) {
      if (controller.signal.aborted) {
        setStatus(entry.id, "cancelled");
        continue;
      }

      setStatus(entry.id, "uploading");
      try {
        await uploadSong(entry, controller.signal);
        setStatus(entry.id, "done");
      } catch (err: unknown) {
        // Distinguish a deliberate cancel (user left the page / pressed
        // Cancel) from a genuine network/server failure. axios.isCancel
        // catches the in-flight rejection; the signal check covers an abort
        // that landed between entries.
        if (axios.isCancel(err) || controller.signal.aborted) {
          setStatus(entry.id, "cancelled");
          continue;
        }
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        const serverMessage = axiosErr?.response?.data?.message;
        if (axiosErr?.response?.status === 409) {
          setStatus(
            entry.id,
            "exists",
            serverMessage || "Already exists in library",
          );
        } else if (serverMessage) {
          // Backend sent an intentional message (e.g. 413 "Audio file is
          // too large. Maximum allowed size is 25 MB", 400 bad file type).
          setStatus(entry.id, "error", serverMessage);
        } else if (err instanceof Error) {
          setStatus(entry.id, "error", err.message);
        } else {
          setStatus(entry.id, "error", "Unknown error");
        }
      }
    }

    isUploadingRef.current = false;
    abortRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const cancelUpload = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const retryEntry = useCallback((id: string) => {
    updateSongs((prev) =>
      prev.map((s) =>
        s.id === id && (s.status === "error" || s.status === "cancelled")
          ? { ...s, status: "idle", error: undefined }
          : s,
      ),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    updateSongs((prev) =>
      prev.filter(
        (s) =>
          s.status === "idle" ||
          s.status === "error" ||
          s.status === "cancelled",
      ),
    );
  }, []);

  const reset = useCallback(() => {
    updateSongs(() => []);
  }, []);

  return {
    songs,
    isRunning,
    addFiles,
    updateEntry,
    removeEntry,
    startUpload,
    cancelUpload,
    retryEntry,
    clearCompleted,
    reset,
  };
}
