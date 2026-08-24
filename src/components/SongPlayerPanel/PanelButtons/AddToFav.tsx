"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleAddToFav } from "@/services/song.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setSongLikedBy,
  setTempSongLikedBy,
  deleteTempSong,
  updatePlaylistSongCount,
} from "@/reduxSlices/song.slice";
import { setMountAuthPromptModal } from "@/reduxSlices/ui.slice";
import { setPlayingSong } from "@/reduxSlices/player.slice";
import { usePathname } from "next/navigation";
import { showToast } from "@/hooks/useToast";

interface AddToFavProps {
  songId: string;
  isLiked: boolean;
  audioRef: AudioRef;
}

const AddToFav: React.FC<AddToFavProps> = ({ songId, isLiked, audioRef }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const playlists = useAppSelector((state) => state.song.playlists);
  const pathname = usePathname();

  const handleClick = async () => {
    if (!audioRef.current) return;
    if (!accessToken) {
      dispatch(setMountAuthPromptModal(true));
      return;
    }
    if (loading) return;

    // Find the default playlist ID to check if we are on the "Favourites" page
    const defaultPlaylistId = playlists.defaultPlaylists.find(
      (p) => p.isDefault,
    )?._id;
    const isOnFavouritesPage =
      defaultPlaylistId && pathname.includes(defaultPlaylistId);

    const originalLikedStatus = isLiked;
    const nextLikedStatus = !isLiked;

    setLoading(true);

    // --- Optimistic Update: Update Redux immediately ---
    const optimisticData = { songId, isLiked: nextLikedStatus };
    dispatch(setSongLikedBy(optimisticData));
    dispatch(setTempSongLikedBy(optimisticData));
    dispatch(updatePlaylistSongCount({ isLiked: nextLikedStatus }));

    // Also update the currently playing song in the player slice if it matches
    if (playingSong && playingSong._id === songId) {
      dispatch(setPlayingSong({ ...playingSong, isLiked: nextLikedStatus }));
    }

    try {
      const likeData = await toggleAddToFav(songId);

      // Verify the final state with the server response
      dispatch(setSongLikedBy(likeData));
      dispatch(setTempSongLikedBy(likeData));

      // If we are unliking while looking at the Favourites playlist, remove it from the view
      if (isOnFavouritesPage && !likeData.isLiked) {
        dispatch(deleteTempSong(songId));
      } else if (playingSong && playingSong._id === songId) {
        // Just sync the playing song state
        dispatch(setPlayingSong({ ...playingSong, isLiked: likeData.isLiked }));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      showToast({
        message: "Couldn't update favourite. Please try again.",
        type: "error",
      });

      // --- Revert: Return to original state on failure ---
      const revertData = { songId, isLiked: originalLikedStatus };
      dispatch(setSongLikedBy(revertData));
      dispatch(setTempSongLikedBy(revertData));
      dispatch(updatePlaylistSongCount({ isLiked: originalLikedStatus }));

      if (playingSong && playingSong._id === songId) {
        dispatch(
          setPlayingSong({ ...playingSong, isLiked: originalLikedStatus }),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
      title={isLiked ? "Remove from favorites" : "Add to favorites"}
      className="focus:outline-none disabled:opacity-100 disabled:cursor-auto"
    >
      <Heart
        size={30}
        className={`
          transition-colors duration-300
          ${isLiked ? "text-red-500" : "text-white"}
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}
        `}
        fill={isLiked ? "currentColor" : "none"}
      />
    </button>
  );
};

export default AddToFav;
