"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { useAppSelector } from "../../store/hook";
import { useHandleSliderChange } from "@/components/useHandleSliderChange";
import PanelTopControls from "./PanelTopControls";
import SongTitleMarquee from "./SongTitleMarquee";
import ProgressSlider from "./ProgressSlider";
import PanelBottomControls from "./PanelBottomControls";

interface SongPanelProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  fadeOutPanel?: (
    panelElement: HTMLDivElement,
    onComplete?: () => void,
  ) => void;
  handlePlayPause: () => void;
  moveToNextSong: () => void;
  moveToPreviousSong: () => void;
  excludeTopControls?: boolean;
}

const SongPlayerPanel = ({
  audioRef,
  handlePlayPause,
  moveToNextSong,
  moveToPreviousSong,
  panelRef,
  fadeOutPanel,
  excludeTopControls = false,
}: SongPanelProps) => {
  const playing = useAppSelector((state) => state.song.playing);
  const duration = useAppSelector((state) => state.song.duration);
  const currentTime = useAppSelector((state) => state.song.currentTime);
  const panelTrigger = useAppSelector((state) => state.song.panelTrigger);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const downloading = useAppSelector((state) => state.song.downloading);
  const repeat = useAppSelector((state) => state.song.repeat);
  const shuffle = useAppSelector((state) => state.song.shuffle);

  const handleSliderChange = useHandleSliderChange(audioRef);

  const fadeInPanel = (panelElement: HTMLDivElement) => {
    gsap.fromTo(
      panelElement,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" },
    );
  };
  // const [triggerLikeStatusCheck, settriggerLikeStatusCheck] = useState(false);
  useEffect(() => {
    if (!panelRef.current) return;
    fadeInPanel(panelRef.current);
  }, [panelRef, panelTrigger]);

  // useEffect(() => {
  //   if (!playingSong?._id) return;
  //   const triggerCheck = async () => {
  //     settriggerLikeStatusCheck(!triggerLikeStatusCheck);
  //   };
  //   triggerCheck();
  // }, [playingSong]);

  if (!playingSong) return null;

  return (
    <div
      ref={panelRef}
      style={{ transform: "translateY(100%)", opacity: 0 }}
      className="fixed bottom-0 left-0 w-full max-w-5xl mx-auto bg-gradient-to-tr from-purple-900/95 via-purple-800/95 to-purple-700/95 border-t border-white/10 rounded-t-xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] text-white z-50 py-4 px-1 lg:py-2 lg:px-2 lg:rounded-xl"
    >
      {/* Top Controls */}
      {!excludeTopControls && (
        <PanelTopControls
          audioRef={audioRef}
          downloading={downloading}
          panelRef={panelRef}
          fadeOutPanel={fadeOutPanel!} // used ! bcuz if i say exlude controls then its obvious that fadeoutpanel is not required
          songId={playingSong._id}
          isLiked={playingSong.isLiked}
        />
      )}
      <hr className="border-white/20" />
      <SongTitleMarquee playingSong={playingSong} />
      <ProgressSlider
        duration={duration}
        currentTime={currentTime}
        handleSliderChange={handleSliderChange}
      />
      <PanelBottomControls
        currentTime={currentTime}
        handlePlayPause={handlePlayPause}
        moveToPreviousSong={moveToPreviousSong}
        moveToNextSong={moveToNextSong}
        playing={playing}
        duration={duration}
        repeat={repeat}
        shuffle={shuffle}
      />
    </div>
  );
};

export default SongPlayerPanel;
