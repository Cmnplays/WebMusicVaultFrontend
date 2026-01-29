"use client";
import { useAppDispatch } from "@/store/hook";
import {
  setPlaying,
  setMountDeleteConfirmation,
} from "@/reduxSlices/song/songSlice";

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
      <i
        className="
                    ri-delete-bin-line 
                    text-white/90 hover:text-orange-400 
                    transition-colors duration-300
                    text-2xl lg:text-3xl
                  "
      />
    </button>
  );
};

export default DeleteBtn;
