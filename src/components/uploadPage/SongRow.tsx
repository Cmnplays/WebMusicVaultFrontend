"use client";
import React, { useRef } from "react";
import {
  Music,
  X,
  Image,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  AlertTriangle,
  Ban,
  RotateCcw,
} from "lucide-react";
import { SongEntry, UploadStatus } from "@/hooks/useUpload";

interface SongRowProps {
  entry: SongEntry;
  index: number;
  isRunning: boolean;
  onUpdate: (id: string, patch: Partial<SongEntry>) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

const statusConfig: Record<
  UploadStatus,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  idle: {
    icon: <Clock size={14} />,
    label: "Pending",
    color: "text-purple-300",
    bg: "bg-purple-500/10",
  },
  uploading: {
    icon: <Loader2 size={14} className="animate-spin" />,
    label: "Uploading…",
    color: "text-blue-300",
    bg: "bg-blue-500/10",
  },
  done: {
    icon: <CheckCircle2 size={14} />,
    label: "Uploaded",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  error: {
    icon: <AlertCircle size={14} />,
    label: "Failed",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  exists: {
    icon: <AlertTriangle size={14} />,
    label: "Already exists",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  cancelled: {
    icon: <Ban size={14} />,
    label: "Cancelled",
    color: "text-white/40",
    bg: "bg-white/5",
  },
};

export function SongRow({
  entry,
  index,
  isRunning,
  onUpdate,
  onRemove,
  onRetry,
}: SongRowProps) {
  const coverRef = useRef<HTMLInputElement>(null);
  const cfg = statusConfig[entry.status];

  const editable =
    entry.status === "idle" ||
    (!isRunning && (entry.status === "error" || entry.status === "cancelled"));
  const canRemove = !isRunning && entry.status !== "uploading";
  const canRetry =
    !isRunning && (entry.status === "error" || entry.status === "cancelled");

  const borderClass = {
    idle: "border-white/10 bg-white/5",
    uploading: "border-blue-500/30 bg-blue-500/5",
    done: "border-emerald-500/20 bg-emerald-500/5",
    error: "border-red-500/20 bg-red-500/5",
    exists: "border-amber-500/20 bg-amber-500/5",
    cancelled: "border-white/5 bg-white/[0.02]",
  }[entry.status];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${borderClass}`}
    >
      {/* ── Mobile ── */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Music size={14} className="text-purple-300" />
            </div>
            <span className="text-white/40 text-xs font-mono">
              #{index + 1}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${cfg.color} ${cfg.bg}`}
            >
              {cfg.icon} {cfg.label}
            </span>
            {canRetry && (
              <button
                onClick={() => onRetry(entry.id)}
                title="Retry"
                className="text-white/30 hover:text-purple-400 transition-colors"
              >
                <RotateCcw size={15} />
              </button>
            )}
            {canRemove && (
              <button
                onClick={() => onRemove(entry.id)}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="text-white/50 text-xs truncate px-1">{entry.file.name.replace(/\.mp3$/i, "")}</p>

        <div className="flex flex-col gap-2">
          <input
            value={entry.title}
            onChange={(e) => onUpdate(entry.id, { title: e.target.value })}
            disabled={!editable}
            placeholder="Song title"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <input
            value={entry.artist}
            onChange={(e) => onUpdate(entry.id, { artist: e.target.value })}
            disabled={!editable}
            placeholder="Artist name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 disabled:opacity-40 disabled:cursor-not-allowed"
          />

          {/* Cover button mobile */}
          <button
            onClick={() => coverRef.current?.click()}
            disabled={!editable}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all w-full"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <Image size={14} className="text-purple-300" />
            </div>
            {entry.coverImage ? (
              <>
                <img
                  src={URL.createObjectURL(entry.coverImage)}
                  alt="cover"
                  className="w-7 h-7 rounded-lg object-cover shrink-0"
                />
                <span className="text-xs text-white/70 truncate">
                  {entry.coverImage.name}
                </span>
                <span className="ml-auto text-xs text-purple-300/60 shrink-0">
                  change
                </span>
              </>
            ) : (
              <span className="text-xs text-white/60">
                Add cover image{" "}
                <span className="text-white/30">(optional)</span>
              </span>
            )}
          </button>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] &&
              onUpdate(entry.id, { coverImage: e.target.files[0] })
            }
          />
        </div>

        {entry.error && (
          <p className="text-xs text-red-300/80 px-1">{entry.error}</p>
        )}
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:grid md:grid-cols-[28px_1fr_1fr_1fr_auto_auto] items-center gap-3 p-4">
        <span className="text-white/30 text-xs font-mono text-center">
          #{index + 1}
        </span>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <Music size={12} className="text-purple-300" />
          </div>
          <span className="text-white/50 text-xs truncate">
            {entry.file.name.replace(/\.mp3$/i, "")}
          </span>
        </div>

        <input
          value={entry.title}
          onChange={(e) => onUpdate(entry.id, { title: e.target.value })}
          disabled={!editable}
          placeholder="Song title"
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 disabled:opacity-40 disabled:cursor-not-allowed w-full"
        />
        <input
          value={entry.artist}
          onChange={(e) => onUpdate(entry.id, { artist: e.target.value })}
          disabled={!editable}
          placeholder="Artist name"
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 disabled:opacity-40 disabled:cursor-not-allowed w-full"
        />

        <span
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full whitespace-nowrap ${cfg.color} ${cfg.bg}`}
        >
          {cfg.icon} {cfg.label}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Cover button desktop */}
          <button
            onClick={() => coverRef.current?.click()}
            disabled={!editable}
            title={entry.coverImage ? entry.coverImage.name : "Add cover image"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {entry.coverImage ? (
              <img
                src={URL.createObjectURL(entry.coverImage)}
                alt="cover"
                className="w-6 h-6 rounded-md object-cover"
              />
            ) : (
              <Image size={14} className="text-purple-300" />
            )}
            <span className="text-xs text-white/50">
              {entry.coverImage ? "change" : "Cover"}
            </span>
          </button>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] &&
              onUpdate(entry.id, { coverImage: e.target.files[0] })
            }
          />

          {canRetry && (
            <button
              onClick={() => onRetry(entry.id)}
              title="Retry"
              className="p-1.5 rounded-lg text-white/30 hover:text-purple-400 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          )}
          {canRemove && (
            <button
              onClick={() => onRemove(entry.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {entry.error && (
        <p className="hidden md:block text-xs text-red-300/80 px-4 pb-3">
          {entry.error}
        </p>
      )}
    </div>
  );
}
