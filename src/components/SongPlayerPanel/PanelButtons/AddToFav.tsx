"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleAddToFav } from "@/services/song.services";
import { useAppDispatch } from "@/store/hook";
import { setSongLikedBy } from "@/reduxSlices/song/songSlice";
interface AddToFavProps {
  songId: string;
  isLiked: boolean;
}

const AddToFav: React.FC<AddToFavProps> = ({ songId, isLiked }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const likeData = await toggleAddToFav(songId);
      console.log({ likeData });
      dispatch(setSongLikedBy(likeData));
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
