"use client";
import { Share2 } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { setMountShareModal, setPlaying } from "@/reduxSlices/song/songSlice";
const ShareSongBtn: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(setPlaying(false));
    dispatch(setMountShareModal(true));
  };
  return (
    <button onClick={handleDelete}>
      <Share2
        size={30}
        className="hover:text-orange-400 
                    transition-colors duration-300"
      />
    </button>
  );
};

export default ShareSongBtn;
