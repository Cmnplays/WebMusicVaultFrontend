"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { deleteSong } from "../../services/song.services";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  deleteSong as excludeSong,
  deleteTempSong as excludeTempSong,
} from "@/reduxSlices/song/songSlice";
import {
  setDeleting,
  setMountDeleteConfirmation,
} from "@/reduxSlices/ui/uiSlice";
import { Button } from "@/components/ui/button";

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
  const deleting = useAppSelector((state) => state.ui.deleting);

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [close, setClose] = useState(false);

  const realPass = "test"; // demo only
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
    );
  }, []);

  const closeWithAnimation = () => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        dispatch(setMountDeleteConfirmation(false));
      },
    });
  };

  const handleDeleteClick = async () => {
    dispatch(setDeleting(true));

    if (password !== realPass) {
      setMessage("Invalid password!");
      setClose(true);
      dispatch(setDeleting(false));
      setTimeout(closeWithAnimation, 800);
      return;
    }

    try {
      await deleteSong(songId);

      if (temp) {
        customExcludeFn
          ? customExcludeFn(songId)
          : dispatch(excludeTempSong(songId));
      } else {
        dispatch(excludeSong(songId));
      }

      setMessage("Successfully deleted song!");

      setTimeout(() => {
        closeWithAnimation();
        moveToNextSong();
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete the song");
    } finally {
      setClose(true);
      dispatch(setDeleting(false));
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4 text-foreground"
      style={{ transformOrigin: "center" }}
    >
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl">
        <h3
          className={`mb-4 text-lg font-semibold line-clamp-2 ${
            message.includes("Successfully")
              ? "text-green-500"
              : message.includes("Invalid")
                ? "text-destructive"
                : "text-foreground"
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
          value={password}
          autoFocus
          placeholder="Enter password"
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
          className="mb-4 w-full rounded-md bg-input px-3 py-2 text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="flex justify-end gap-3">
          {!close ? (
            <>
              <Button
                variant="secondary"
                onClick={closeWithAnimation}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={closeWithAnimation}>Close</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
