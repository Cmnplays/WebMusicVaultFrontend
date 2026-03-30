"use client";
import { Music2, Trash2, Upload, XCircle } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { DropZone } from "@/components/uploadPage/DropZone";
import { ProgressList } from "@/components/uploadPage/ProgressList";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function UploadPage() {
  const {
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
  } = useUpload();

  const idleCount = songs.filter((s) => s.status === "idle").length;
  const hasCompleted = songs.some(
    (s) => s.status === "done" || s.status === "exists",
  );
  const allDone =
    songs.length > 0 &&
    songs.every((s) => s.status !== "idle" && s.status !== "uploading");

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-transparent flex justify-center items-start p-4 pb-12">
        <div className="w-full max-w-2xl mt-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Music2 size={20} className="text-purple-300" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">
                Upload Songs
              </h1>
              <p className="text-purple-300/60 text-xs">
                Up to 5 songs · Uploaded one by one
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col gap-5 shadow-2xl shadow-black/30">
            <DropZone
              onFiles={addFiles}
              disabled={isRunning}
              currentCount={songs.length}
            />

            {songs.length > 0 && (
              <ProgressList
                songs={songs}
                isRunning={isRunning}
                onUpdate={updateEntry}
                onRemove={removeEntry}
                onRetry={retryEntry}
              />
            )}

            {songs.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                {isRunning ? (
                  <button
                    onClick={cancelUpload}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold py-3 rounded-2xl transition-all"
                  >
                    <XCircle size={16} /> Cancel Upload
                  </button>
                ) : (
                  <button
                    onClick={startUpload}
                    disabled={!idleCount}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600/70 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Upload size={16} />
                    {`Upload ${idleCount} Song${idleCount !== 1 ? "s" : ""}`}
                  </button>
                )}

                {hasCompleted && !isRunning && (
                  <button
                    onClick={clearCompleted}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all text-sm"
                  >
                    <Trash2 size={14} /> Clear done
                  </button>
                )}

                {allDone && (
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all text-sm"
                  >
                    Start over
                  </button>
                )}
              </div>
            )}

            <p className="text-purple-300/40 text-xs text-center">
              Each song is uploaded individually · May take up to 2 min per file
            </p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
