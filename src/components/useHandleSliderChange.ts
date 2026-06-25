import { useAppDispatch } from "../store/hook";
import { setCurrentTime } from "../reduxSlices/player/player.slice";
export const useHandleSliderChange = (
  audioRef: React.RefObject<HTMLAudioElement | null>,
) => {
  const dispatch = useAppDispatch();
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    dispatch(setCurrentTime(value));
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };
  return handleSliderChange;
};
