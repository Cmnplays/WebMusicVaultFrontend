import React from "react";
import DeleteBtn from "./PanelButtons/DeleteBtn";
import ClosePanelBtn from "./PanelButtons/ClosePanelBtn";
import DownloadBtn from "./PanelButtons/DownloadBtn";
import ShareSongBtn from "./PanelButtons/ShareSongBtn";
import AddToFav from "./PanelButtons/AddToFav";
interface PanelTopControlsProps {
  audioRef: AudioRef;
  downloading: boolean;
  fadeOutPanel: (panelElement: HTMLDivElement, onComplete?: () => void) => void;
  panelRef: PanelRef;
  songId: string;
  isLiked: boolean;
}
const PanelTopControls: React.FC<PanelTopControlsProps> = ({
  audioRef,
  downloading,
  fadeOutPanel,
  panelRef,
  songId,
  isLiked,
}) => {
  return (
    <div className="flex w-full justify-around mb-2 lg:mb-2">
      <DeleteBtn audioRef={audioRef} />
      <ShareSongBtn songId={songId} />
      <ClosePanelBtn
        panelRef={panelRef}
        audioRef={audioRef}
        downloading={downloading}
        fadeOutPanel={fadeOutPanel}
      />
      <DownloadBtn downloading={downloading} />
      <AddToFav songId={songId} isLiked={isLiked} />
    </div>
  );
};

export default PanelTopControls;
