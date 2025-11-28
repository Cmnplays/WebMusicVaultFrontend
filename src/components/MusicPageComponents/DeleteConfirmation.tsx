import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { deleteSong } from "../../services/song.services";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  setDeleting,
  setMountDeleteConfirmation,
  deleteSong as excludeSong,
  deleteTempSong as excludeTempSong,
} from "../../reduxSlices/song/songSlice";

interface DeleteConfirmationProps {
  title: string;
  songId: string;
  moveToNextSong: () => void;
  temp?: boolean;
  customExcludeFn?: (songId: string) => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  title,
  songId,
  moveToNextSong,
  temp = false,
  customExcludeFn,
}) => {
  const dispatch = useAppDispatch();
  const deleting = useAppSelector((state) => state.song.deleting);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const realPass = "test"; // just for demo
  const containerRef = useRef<HTMLDivElement>(null);
  const [close, setClose] = useState<boolean>(false);

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
      onComplete: () => {
        dispatch(setMountDeleteConfirmation(false));
      },
    });
  };

  const handleDeleteClick = async () => {
    dispatch(setDeleting(true));

    if (password !== realPass) {
      setMessage("Invalid Password!");
      setClose(true);
      dispatch(setDeleting(false));
      setTimeout(() => {
        closeWithAnimation();
      }, 800);
      return;
    }

    try {
      await deleteSong(songId);
      if (temp) {
        if (!customExcludeFn) {
          dispatch(excludeTempSong(songId));
        } else {
          customExcludeFn(songId);
        }
      } else {
        dispatch(excludeSong(songId));
      }

      setMessage("Successfully deleted song!");

      setTimeout(() => {
        closeWithAnimation();
        moveToNextSong();
      }, 1200);
    } catch (error) {
      setMessage("Failed to delete the song");
      console.error(error);
    } finally {
      setClose(true);
      dispatch(setDeleting(false));
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-50 px-4 text-black"
      style={{ transformOrigin: "center" }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        {/* Status message or original text */}
        <h3
          className={`text-lg font-semibold mb-4 truncate ${
            message === "Successfully deleted song"
              ? "text-green-600"
              : message === "Invalid Password!"
              ? "text-red-600"
              : "text-black"
          }`}
        >
          {message || (
            <>
              Enter password to delete{" "}
              <span className="font-bold">{title}</span>
            </>
          )}
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

        <div className="flex justify-end gap-3">
          {!close ? (
            <>
              <button
                onClick={closeWithAnimation}
                disabled={deleting}
                className={`px-4 py-2 rounded text-black transition 
                  ${
                    deleting
                      ? "bg-gray-200 opacity-50 cursor-not-allowed shadow-none"
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
                      ? "bg-purple-400 opacity-50 cursor-not-allowed shadow-none"
                      : "bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md"
                  }`}
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={closeWithAnimation}
              className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
