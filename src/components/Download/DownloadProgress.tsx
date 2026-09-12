"use client";
import { useAppSelector } from "@/store/hook";
import { cancelActiveDownload } from "@/hooks/useHandleDownload";
import { Download, X } from "lucide-react";

/**
 * Small, NON-BLOCKING download progress card (fixed top-right, below the
 * modals' z-index). Shown only while a download is in flight — the user can
 * keep scrolling and browsing while it runs, or cancel it with the X.
 *
 * Deliberately has NO backdrop-filter: blur is the #1 lag source on
 * low-end mobile devices (see the mobile-no-blur / useNoBlurOnMobile
 * history), and a persistent card must be free of it.
 */
const DownloadProgress = () => {
  const downloading = useAppSelector((state) => state.ui.downloading);
  const progress = useAppSelector((state) => state.ui.downloadProgress);
  const title = useAppSelector((state) => state.ui.downloadTitle);

  if (!downloading) return null;

  // progress === null → fallback path (no Content-Length) → indeterminate bar
  const indeterminate = progress === null;
  const pct = progress ?? 0;
  const displayTitle = (title ?? "").replace(/\.mp3$/i, "");

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 right-4 z-100 w-64 rounded-xl border border-white/10 bg-[#1a0635]/95 shadow-2xl shadow-black/40 p-3 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <Download size={16} className="text-purple-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate leading-tight">
            {displayTitle || "Downloading"}
          </p>
          <p className="text-[10px] text-purple-300/70">
            {indeterminate ? "Downloading…" : `${pct}%`}
          </p>
        </div>
        <button
          type="button"
          onClick={cancelActiveDownload}
          aria-label="Cancel download"
          title="Cancel download"
          className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        {indeterminate ? (
          <div className="h-full w-1/3 rounded-full bg-purple-400 animate-[downloadSlide_1.2s_ease-in-out_infinite]" />
        ) : (
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default DownloadProgress;
