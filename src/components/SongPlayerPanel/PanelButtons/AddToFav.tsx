"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleAddToFav } from "@/services/song.services";

interface AddToFavProps {
  songId: string;
  isFav: boolean;
}

const AddToFav: React.FC<AddToFavProps> = ({ songId, isFav }) => {
  const [liked, setLiked] = useState(isFav);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    const previous = liked;
    setLiked(!liked);
    try {
      await toggleAddToFav(songId);
    } catch (err) {
      console.error(err);
      setLiked(previous);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLiked(isFav);
  }, [isFav]);
  return (
    <button onClick={handleClick} disabled={loading}>
      <Heart
        size={30}
        className={`
          transition-colors duration-300
          ${liked ? "text-red-500" : "text-white"}
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}
        `}
        fill={liked ? "currentColor" : "none"}
      />
    </button>
  );
};

export default AddToFav;
