import React from "react";

interface ModalViewerProps {
  open: boolean;
  type: "photo" | "video" | "audio" | null;
  src: string;
  onClose: () => void;
}

export default function ModalViewer({
  open,
  type,
  src,
  onClose,
}: ModalViewerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {type === "photo" && (
          <img
            src={src}
            className="w-full max-h-[90vh] object-contain rounded-lg"
          />
        )}

        {type === "video" && (
          <video
            controls
            autoPlay
            src={src}
            className="w-full max-h-[90vh] rounded-lg"
          />
        )}

        {type === "audio" && (
          <div className="bg-slate-900 p-6 rounded-lg">
            <audio controls autoPlay src={src} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
