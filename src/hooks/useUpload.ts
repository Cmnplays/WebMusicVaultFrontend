"use client";
import { useState, useCallback, useRef } from "react";

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
    const newEntries: SongEntry[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      title: file.name.replace(/\.[^.]+$/, ""),
      artist: "",
      status: "idle",
    }));
    updateSongs((prev) => [...prev, ...newEntries].slice(0, 5));
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
    setIsRunning(true);

    for (const entry of pending) {
      if (controller.signal.aborted) {
        setStatus(entry.id, "cancelled");
        continue;
      }

      setStatus(entry.id, "uploading");
      try {
        setStatus(entry.id, "done");
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          setStatus(entry.id, "cancelled");
          continue;
        }
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr?.response?.status === 409) {
          setStatus(entry.id, "exists", "Already exists in library");
        } else if (err instanceof Error) {
          setStatus(entry.id, "error", err.message);
        } else {
          setStatus(entry.id, "error", "Unknown error");
        }
      }
    }

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
