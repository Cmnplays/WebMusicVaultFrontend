"use client";
import { useAppDispatch } from "@/store/hook";
import {
  setPlaying,
  setMountDeleteConfirmation,
} from "@/reduxSlices/song/songSlice";
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
    <button onClick={handleDelete}>
      <Trash
        size={30}
        className="hover:text-orange-400 
                    transition-colors duration-300"
      />
    </button>
  );
};

export default DeleteBtn;
