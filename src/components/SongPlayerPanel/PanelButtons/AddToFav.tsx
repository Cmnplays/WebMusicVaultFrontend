"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleAddToFav } from "@/services/song.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setSongLikedBy,
  setTempSongLikedBy,
  deleteTempSong,
} from "@/reduxSlices/song/songSlice";
import { setMountAuthPromptModal } from "@/reduxSlices/ui/uiSlice";
import {
  setPlayingSong,
  setPlaying,
  setExpandedPanelOpen,
  setMiniPanelOpen,
} from "@/reduxSlices/player/playerSlice";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const handleClick = async () => {
    if (!audioRef.current) return;
    if (!accessToken) {
      dispatch(setMountAuthPromptModal(true));
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const likeData = await toggleAddToFav(songId);
      dispatch(setSongLikedBy(likeData));
      dispatch(setTempSongLikedBy(likeData));

      const isUnlikingOnLikedPage =
        pathname.startsWith("/liked-songs") && !likeData.isLiked;
      if (isUnlikingOnLikedPage) {
        dispatch(deleteTempSong(songId));
      }

      if (playingSong && playingSong._id === songId) {
        if (isUnlikingOnLikedPage) {
          audioRef.current.pause();
          dispatch(setPlaying(false));
          dispatch(setExpandedPanelOpen(false));
          dispatch(setMiniPanelOpen(false));
        } else {
          dispatch(
            setPlayingSong({ ...playingSong, isLiked: likeData.isLiked }),
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
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
