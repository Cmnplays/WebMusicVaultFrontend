"use client";
import { useAppDispatch } from "@/store/hook";
import { setPlaying } from "@/reduxSlices/player/playerSlice";
import { setMountDeleteConfirmation } from "@/reduxSlices/ui/uiSlice";
import { Trash } from "lucide-react";
interface DeleteBtnProps {
  audioRef: AudioRef;
}
const DeleteBtn: React.FC<DeleteBtnProps> = ({ audioRef }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (!audioRef.current) return;
    dispatch(setPlaying(false));
    audioRef.current.pause();
    dispatch(setMountDeleteConfirmation(true));
  };
  return (
    <button
      onClick={handleDelete}
      aria-label="Delete song"
      title="Delete song"
    >
      <Trash
        size={30}
        className="hover:text-orange-400 transition-colors duration-300"
      />
    </button>
  );
};

export default DeleteBtn;
