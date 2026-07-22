"use client";
import { Share2 } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { setMountShareModal } from "@/reduxSlices/ui.slice";
const ShareSongBtn: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(setMountShareModal(true));
  };
  return (
    <button onClick={handleDelete} aria-label="Share song" title="Share song">
      <Share2
        size={30}
        className="hover:text-orange-400 transition-colors duration-300"
      />
    </button>
  );
};

export default ShareSongBtn;
