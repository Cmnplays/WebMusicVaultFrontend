"use client";
import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { setMountEditSongModal } from "@/reduxSlices/ui.slice";
import { fadeInPanel, fadeOutPanel } from "@/lib/animations";
import { X, Save } from "lucide-react";

const SongEditPanel = () => {
  const dispatch = useAppDispatch();
  const editPanelRef = useRef<HTMLDivElement>(null);
  const editableSong = useAppSelector((state) => state.song.editableSong);

  // Track the toggle state from your uiSlice
  const mountEditSongModal = useAppSelector(
    (state) => state.ui.mountEditSongModal,
  );

  // Animate in when the modal state becomes true
  useEffect(() => {
    if (!editPanelRef.current || !mountEditSongModal) return;
    fadeInPanel(editPanelRef.current);
  }, [mountEditSongModal]);

  const handleClose = () => {
    if (!editPanelRef.current) return;
    // Animate out before closing the state completely
    fadeOutPanel(editPanelRef.current, () => {
      dispatch(setMountEditSongModal(false));
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Your update logic / form submission here...
    handleClose();
  };

  // If the Redux state is false, don't render anything in the DOM footprint
  if (!mountEditSongModal) return null;

  return (
    <div
      ref={editPanelRef}
      style={{ transform: "translateY(100%)", opacity: 100 }}
      className="z-100 fixed bottom-0 left-0 w-full max-w-5xl mx-auto bg-gradient-to-tr from-purple-900/95 via-purple-800/95 to-purple-700/95 border-t border-white/10 rounded-t-xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] text-white z-50 py-4 px-4 lg:py-4 lg:px-6 lg:rounded-xl"
    >
      {/* Panel Top Header Controls */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-cream/70 tracking-[0.2em] uppercase font-medium">
            Admin Actions
          </span>
          <h2 className="text-base font-bold text-white">Edit Song Details</h2>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <hr className="border-white/20 mb-4" />

      {/* Matching Form Layout */}
      <form onSubmit={handleSave} className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Input Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-purple-200/80 tracking-wide">
              Song Title
            </label>
            <input
              type="text"
              defaultValue={editableSong?.title?.replace(/\.mp3$/i, "") || ""}
              placeholder="e.g., Bella Ciao"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all"
            />
          </div>

          {/* Artist Input Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-purple-200/80 tracking-wide">
              Artist / Owner
            </label>
            <input
              type="text"
              defaultValue={editableSong?.artist || ""}
              placeholder="e.g., Manu Pilas"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all"
            />
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-purple-900 rounded-lg hover:bg-purple-100 transition-all shadow-md focus:outline-none"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SongEditPanel;
