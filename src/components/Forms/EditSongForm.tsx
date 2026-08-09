"use client";
import { useState, useRef, useEffect } from "react";
import { Save, Music2, Mic2, Image, Trash2 } from "lucide-react";
import SongCover from "../ui/SongCover";
import NextImage from "next/image";
import type { Song, SongChanges } from "@/services/song.services";

interface SongEditFormProps {
    song: Song;
    onSave: (changes: SongChanges) => void | Promise<void>;
    onCancel: () => void;
}

const SongEditForm = ({ song, onSave, onCancel }: SongEditFormProps) => {
    // Lazy initializers read straight from `song` on mount. Since this whole
    // component remounts (via `key={song._id}` in the parent) whenever a
    // different song is opened, these always start correct — no effect
    // needed to "sync" them.
    const [title, setTitle] = useState(() =>
        song.title ? song.title.replace(/\.mp3$/i, "") : "",
    );
    const [artist, setArtist] = useState(() => song.artist ?? "");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [removeCoverImage, setRemoveCoverImage] = useState<boolean>(false);
    const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);

    // Cleanup-only effect: releases the blob URL when this form instance goes
    // away (different song opened -> remount, or modal closed -> unmount).
    // No state setter is called here, so this is not subject to
    // react-hooks/set-state-in-effect.
    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
        setRemoveCoverImage(false);
        setCoverImage(file);
        const url = URL.createObjectURL(file);
        previewUrlRef.current = url;
        setNewImagePreview(url);
    };

    const handleRemoveCover = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        setRemoveCoverImage(true);
        setCoverImage(null);
        setNewImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const changes: SongChanges = { songId: song._id };

        const initialTitle = song.title ? song.title.replace(/\.mp3$/i, "") : "";
        if (initialTitle !== title.trim()) changes.title = title.trim();
        if ((song.artist || "") !== artist.trim()) changes.artist = artist.trim();
        if (coverImage) changes.coverImage = coverImage;
        if (removeCoverImage) changes.removeCoverImage = true;

        if (!changes.title && !changes.artist && !changes.coverImage && !changes.removeCoverImage) {
            onCancel();
            return;
        }
        onSave(changes);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
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

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 group border border-white/10"
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
                                    id={song._id}
                                    title={title || song.title}
                                    artist={artist || song.artist}
                                    src={removeCoverImage ? undefined : song.coverImageUrl}
                                    size="sm"
                                    className="w-full h-full"
                                />
                            )}

                            {/* Darken on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Always-visible edit badge */}
                            <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-purple-600 border border-white/30 flex items-center justify-center shadow-md">
                                <Image size={11} className="text-white" aria-hidden="true" />
                            </div>
                        </button>

                        {/* Remove / Reset Thumbnail Button */}
                        {((song.coverImageUrl && !removeCoverImage) || newImagePreview) ? (
                            <button
                                type="button"
                                onClick={handleRemoveCover}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove thumbnail</span>
                            </button>
                        ) : removeCoverImage ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-amber-300 font-medium">Thumbnail marked for removal</span>
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="text-[11px] font-semibold text-purple-300 underline hover:text-white"
                                >
                                    Choose new image
                                </button>
                            </div>
                        ) : null}
                    </div>
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
                            value={title}
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
                            value={artist}
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
                    onClick={onCancel}
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
    );
};

export default SongEditForm;