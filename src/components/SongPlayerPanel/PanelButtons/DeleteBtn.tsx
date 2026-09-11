"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setPlaying } from "@/reduxSlices/player.slice";
import { setMountDeleteConfirmation, setActionSong } from "@/reduxSlices/ui.slice";
import { Trash } from "lucide-react";
interface DeleteBtnProps {
  audioRef: AudioRef;
}
const DeleteBtn: React.FC<DeleteBtnProps> = ({ audioRef }) => {
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.player.playingSong);

  const handleDelete = () => {
    if (!audioRef.current) return;
    dispatch(setPlaying(false));
    audioRef.current.pause();
    if (playingSong) {
      dispatch(setActionSong(playingSong));
    }
    dispatch(setMountDeleteConfirmation(true));
  };
  return (
    <button onClick={handleDelete} aria-label="Delete song" title="Delete song">
      <Trash
        size={30}
        className="hover:text-orange-400 transition-colors duration-300"
      />
    </button>
  );
};

export default DeleteBtn;
