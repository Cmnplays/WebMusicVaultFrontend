"use client";
import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  currentCount: number;
}

export function DropZone({ onFiles, disabled, currentCount }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = 5 - currentCount;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || remaining <= 0) return;
    const files = Array.from(e.dataTransfer.files)
      .filter((f) => f.type.startsWith("audio/"))
      .slice(0, remaining);
    if (files.length) onFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFiles(Array.from(e.target.files).slice(0, remaining));
      e.target.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled || remaining <= 0 ? -1 : 0}
      aria-label={remaining > 0 ? `Drop audio files here, or press Enter to browse. ${remaining} slot${remaining !== 1 ? "s" : ""} remaining.` : "Maximum 5 songs reached"}
      onClick={() => !disabled && remaining > 0 && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && remaining > 0) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
        ${
          disabled || remaining <= 0
            ? "border-white/10 cursor-not-allowed opacity-50"
            : "border-purple-400/30 cursor-pointer hover:border-purple-400/70 hover:bg-purple-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        }
      `}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center" aria-hidden="true">
          <Upload size={22} className="text-purple-300" />
        </div>
        {remaining > 0 ? (
          <>
            <p className="text-white font-semibold">Drop audio files here</p>
            <p className="text-purple-300/70 text-sm">
              or click to browse · {remaining} slot{remaining !== 1 ? "s" : ""}{" "}
              left
            </p>
          </>
        ) : (
          <p className="text-purple-300/70 text-sm">Max 5 songs reached</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        aria-hidden="true"
        onChange={handleChange}
      />
    </div>
  );
}
