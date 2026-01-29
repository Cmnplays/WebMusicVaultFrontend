import React from "react";
import DeleteBtn from "./PanelButtons/DeleteBtn";
import ClosePanelBtn from "./PanelButtons/ClosePanelBtn";
import DownloadBtn from "./PanelButtons/DownloadBtn";
interface PanelTopControlsProps {
  audioRef: AudioRef;
  downloading: boolean;
  fadeOutPanel: (panelElement: HTMLDivElement, onComplete?: () => void) => void;
  panelRef: PanelRef;
}
const PanelTopControls: React.FC<PanelTopControlsProps> = ({
  audioRef,
  downloading,
  fadeOutPanel,
  panelRef,
}) => {
  return (
    <div className="flex w-full justify-around mb-2 lg:mb-2">
      <DeleteBtn audioRef={audioRef} />
      <ClosePanelBtn
        panelRef={panelRef}
        audioRef={audioRef}
        downloading={downloading}
        fadeOutPanel={fadeOutPanel}
      />
      <DownloadBtn downloading={downloading} />
    </div>
  );
};

export default PanelTopControls;
