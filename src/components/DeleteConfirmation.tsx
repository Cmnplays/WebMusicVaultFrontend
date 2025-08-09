import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { deleteSong, type Song } from "../services/song.services";

interface DeleteConfirmationProps {
  title: string;
  songId: string;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setMountDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  deleting: boolean;
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  songs: Song[];
  moveToNextSong: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  title,
  songId,
  setDeleting,
  setMountDeleteConfirmation,
  deleting,
  setSongs,
  songs,
  moveToNextSong,
}) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const realPass = import.meta.env.VITE_DELETION_PASSWORD;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const closeWithAnimation = () => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      duration: 0.4,
      opacity: 0,
      scale: 0.95,
      ease: "power2.in",
      onComplete: () => setMountDeleteConfirmation(false),
    });
  };

  const handleDeleteClick = async () => {
    setDeleting(true);
    if (password === realPass) {
      try {
        await deleteSong(songId);
        setMessage("Successfully deleted song");
        setTimeout(() => {
          closeWithAnimation();
          moveToNextSong();
        }, 1200);
        setSongs(songs.filter((s) => s._id !== songId));
      } catch (error) {
        setMessage("Failed to delete the song");
        console.error(error);
      }
    } else {
      setMessage("Invalid Password! Cannot delete the song");
      setTimeout(closeWithAnimation, 1200);
    }
    setDeleting(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-50 px-4"
      style={{ transformOrigin: "center" }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 truncate">
          Enter password to delete <span className="font-bold">{title}</span>
        </h3>

        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
          value={password}
          placeholder="Enter password"
          autoFocus
        />

        {message && (
          <div
            className={`mb-3 text-sm ${
              message.includes("Successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeWithAnimation}
            disabled={deleting}
            className={`px-4 py-2 rounded transition 
      ${
        deleting
          ? "bg-gray-300 cursor-not-allowed opacity-60"
          : "bg-gray-300 hover:bg-gray-400 shadow-sm hover:shadow-md"
      }`}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className={`px-4 py-2 rounded text-white transition 
      ${
        deleting
          ? "bg-purple-400 cursor-not-allowed opacity-60"
          : "bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md"
      }`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
