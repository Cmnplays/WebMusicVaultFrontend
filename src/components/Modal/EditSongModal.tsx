"use client";
import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { setMountEditSongModal } from "@/reduxSlices/ui.slice";
import { fadeInPanel, fadeOutPanel } from "@/lib/animations";
import { X, Save, Music2, Mic2, Image } from "lucide-react";
import SongCover from "../ui/SongCover";
import {
  setMiniPanelOpen,
  setExpandedPanelOpen,
} from "@/reduxSlices/player.slice";
import NextImage from "next/image";
import { SongChanges } from "@/services/song.services";
import { updateSong } from "@/services/song.services";
import { updateSong as updateSongInRedux } from "@/reduxSlices/song.slice";

const SongEditPanel = () => {
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");

  const dispatch = useAppDispatch();
  const editPanelRef = useRef<HTMLDivElement>(null);
  const editableSong = useAppSelector((state) => state.song.editableSong);
  const mountEditSongModal = useAppSelector(
    (state) => state.ui.mountEditSongModal,
  );

  useEffect(() => {
    if (!editPanelRef.current || !mountEditSongModal) return;
    dispatch(setExpandedPanelOpen(false));
    dispatch(setMiniPanelOpen(false));
    fadeInPanel(editPanelRef.current);
  }, [mountEditSongModal]);

  const handleClose = () => {
    if (!editPanelRef.current) return;
    fadeOutPanel(editPanelRef.current, () => {
      dispatch(setMountEditSongModal(false));
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableSong) {
      handleClose();
      return;
    }
    const changes: SongChanges = { songId: editableSong._id };

    if (editableSong?.title !== title) changes.title = title;
    if (editableSong?.artist !== artist) changes.artist = artist;
    if (coverImage) changes.coverImage = coverImage;
    if (!changes.title && !changes.artist && !changes.coverImage) {
      handleClose();
      return;
    }
    const updatedSong = await updateSong(changes);
    dispatch(
      updateSongInRedux({
        songId: updatedSong._id,
        title: updatedSong.title,
        artist: updatedSong.artist,
        coverImageUrl: updatedSong.coverImageUrl,
        ...(editableSong.isTemp && { isTemp: true }),
      }),
    );
    handleClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  if (!mountEditSongModal || !editableSong) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        aria-hidden="true"
      />

      <div
        ref={editPanelRef}
        style={{ transform: "translateY(100%)", opacity: 0 }}
        className="fixed bottom-0 left-0 w-full max-w-5xl mx-auto right-0 bg-gradient-to-tr from-purple-900/95 via-purple-800/95 to-purple-700/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.4)] text-white z-50 py-4 px-4 lg:py-5 lg:px-6 lg:rounded-2xl lg:bottom-6"
      >
        {/* Drag handle (mobile affordance) */}
        <div className="flex justify-center mb-3 lg:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Panel Top Header Controls */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <Music2 className="w-5 h-5 text-purple-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-purple-200/70 tracking-[0.2em] uppercase font-medium">
                Admin Actions
              </span>
              <h2 className="text-base font-bold text-white leading-tight">
                Edit Song Details
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <hr className="border-white/10 mb-4" />

        {/* Matching Form Layout */}
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Song thumbnail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-purple-200/80 tracking-wide">
                Song Thumbnail
              </label>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 group"
              >
                {newImagePreview ? (
                  <NextImage
                    src={newImagePreview}
                    alt="New thumbnail preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <SongCover
                    id={editableSong._id}
                    title={editableSong.title}
                    artist={editableSong.artist}
                    src={editableSong.coverImageUrl}
                    size="sm"
                    className="w-full h-full"
                  />
                )}

                {/* Darken on hover (desktop) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Always-visible edit badge */}
                <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-purple-600 border border-white/30 flex items-center justify-center shadow-md">
                  <Image size={11} className="text-white" />
                </div>
              </button>
            </div>
            {/* Title Input Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-purple-200/80 tracking-wide">
                Song Title
              </label>
              <div className="relative">
                <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50 pointer-events-none" />
                <input
                  type="text"
                  defaultValue={
                    editableSong?.title?.replace(/\.mp3$/i, "") || ""
                  }
                  placeholder="e.g., Bella Ciao"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Artist Input Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-purple-200/80 tracking-wide">
                Artist / Owner
              </label>
              <div className="relative">
                <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50 pointer-events-none" />
                <input
                  type="text"
                  defaultValue={editableSong?.artist || ""}
                  placeholder="e.g., Manu Pilas"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all"
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bottom Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-white text-purple-900 rounded-xl hover:bg-purple-100 active:scale-[0.98] transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SongEditPanel;
