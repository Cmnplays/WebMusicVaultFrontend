"use client";
import { useAppDispatch } from "@/store/hook";
import {
  setExpandedPanelOpen,
  setRepeat,
  setPlaying,
} from "@/reduxSlices/player.slice";

interface ClosePanelBtnProps {
  panelRef: PanelRef;
  audioRef: AudioRef;
  downloading: boolean;
  fadeOutPanel: (panelElement: HTMLDivElement, onComplete?: () => void) => void;
}
const ClosePanelBtn: React.FC<ClosePanelBtnProps> = ({
  panelRef,
  audioRef,
  downloading,
  fadeOutPanel,
}) => {
  const dispatch = useAppDispatch();
  const handlePanelClose = () => {
    if (panelRef.current && audioRef && !downloading) {
      fadeOutPanel(panelRef.current, () => {
        dispatch(setExpandedPanelOpen(false));
        dispatch(setRepeat("repeat"));
      });
      audioRef.current!.pause();
      dispatch(setPlaying(false));
    }
  };
  return (
    <i
      className="
                 ri-arrow-down-wide-line 
                 text-white/90 hover:text-orange-400 
                 transition-colors duration-300
                 text-3xl lg:text-4xl
               "
      role="button"
      aria-label="Close player panel"
      onClick={handlePanelClose}
    />
  );
};

export default ClosePanelBtn;
