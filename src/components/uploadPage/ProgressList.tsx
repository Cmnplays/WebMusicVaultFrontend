"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { SongEntry } from "@/hooks/useUpload";
import { SongRow } from "./SongRow";

interface ProgressListProps {
  songs: SongEntry[];
  isRunning: boolean;
  onUpdate: (id: string, patch: Partial<SongEntry>) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export function ProgressList({
  songs,
  isRunning,
  onUpdate,
  onRemove,
  onRetry,
}: ProgressListProps) {
  if (!songs.length) return null;

  const done = songs.filter((s) => s.status === "done").length;
  const total = songs.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      {(isRunning || done > 0) && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-purple-300 font-mono shrink-0">
            {done}/{total}
          </span>
          {done === total && (
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          )}
        </div>
      )}

      <div className="hidden md:grid md:grid-cols-[28px_1fr_1fr_1fr_auto_auto] gap-3 px-4 pb-1">
        {["#", "File", "Title", "Artist", "Status", ""].map((h, i) => (
          <span
            key={i}
            className="text-white/30 text-xs uppercase tracking-wider"
          >
            {h}
          </span>
        ))}
      </div>

      {songs.map((entry, i) => (
        <SongRow
          key={entry.id}
          entry={entry}
          index={i}
          isRunning={isRunning}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}
