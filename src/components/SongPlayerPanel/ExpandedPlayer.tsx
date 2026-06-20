"use client";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ChevronDown } from "lucide-react";
import { Vibrant } from "node-vibrant/browser";
import gsap from "gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useHandleSliderChange } from "@/components/useHandleSliderChange";
import SongTitleMarquee from "@/components/SongPlayerPanel/SongTitleMarquee";
import ProgressSlider from "@/components/SongPlayerPanel/ProgressSlider";
import PanelBottomControls from "@/components/SongPlayerPanel/PanelBottomControls";
import PanelTopControls from "@/components/SongPlayerPanel/PanelTopControls";
import { setExpandedPanelOpen } from "@/reduxSlices/player/playerSlice";
import { fadeInExpandedPanel, fadeOutExpandedPanel } from "@/lib/animations";
import SongCover, {
  getSongGradientIndex,
  gradientColors,
} from "@/components/ui/SongCover";

interface ExpandedPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handlePlayPause: () => void;
  moveToNextSong: () => void;
  moveToPreviousSong: () => void;
}

const ExpandedPlayer = ({
  audioRef,
  handlePlayPause,
  moveToNextSong,
  moveToPreviousSong,
}: ExpandedPlayerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState("#1a0635");
  const dispatch = useAppDispatch();

  const playingSong = useAppSelector((state) => state.player.playingSong);
  const playing = useAppSelector((state) => state.player.playing);
  const duration = useAppSelector((state) => state.player.duration);
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const repeat = useAppSelector((state) => state.player.repeat);
  const shuffle = useAppSelector((state) => state.player.shuffle);
  const downloading = useAppSelector((state) => state.ui.downloading);
  const expandedPanelOpen = useAppSelector(
    (state) => state.player.expandedPanelOpen,
  );

  const handleSliderChange = useHandleSliderChange(audioRef);

  useEffect(() => {
    let mounted = true;

    Promise.resolve().then(() => {
      if (!playingSong?.coverImageUrl) {
        const index = getSongGradientIndex(
          playingSong?._id || "",
          playingSong?.title || "",
        );
        if (mounted) setBgColor(gradientColors[index]);
        return;
      }

      return Vibrant.from(playingSong.coverImageUrl)
        .getPalette()
        .then((palette) => {
          if (!mounted) return;
          const color =
            palette.DarkVibrant?.hex ?? palette.Vibrant?.hex ?? "#1a0635";
          setBgColor(color);
        })
        .catch(() => {
          if (!mounted) return;
          setBgColor("#1a0635");
        });
    });

    return () => {
      mounted = false;
    };
  }, [playingSong?.coverImageUrl, playingSong?._id, playingSong?.title]);

  const isMount = useRef(true);

  useEffect(() => {
    if (!panelRef.current) return;
    if (isMount.current) {
      isMount.current = false;
      if (!expandedPanelOpen) {
        gsap.set(panelRef.current, { y: "100%", opacity: 0 });
      } else {
        fadeInExpandedPanel(panelRef.current);
      }
      return;
    }

    if (expandedPanelOpen) {
      fadeInExpandedPanel(panelRef.current);
    } else {
      fadeOutExpandedPanel(panelRef.current);
    }
  }, [expandedPanelOpen]);

  if (!playingSong) return null;

  function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }

  return (
    <div
      ref={panelRef}
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.8s ease",
      }}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col text-white overflow-hidden",
        !expandedPanelOpen && "opacity-0 translate-y-full pointer-events-none",
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-10 pb-2 shrink-0">
          <button
            onClick={() => dispatch(setExpandedPanelOpen(false))}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <ChevronDown size={28} />
          </button>
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
            Now Playing
          </p>
          <div className="w-8" />
        </div>

        {/* Cover Art */}
        <div className="flex-1 flex items-center justify-center px-6 min-h-0">
          <div
            className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] aspect-square"
            style={{ maxHeight: "100%" }}
          >
            <SongCover
              id={playingSong._id}
              title={playingSong.title}
              artist={playingSong.artist}
              src={playingSong.coverImageUrl}
              size="lg"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Player controls */}
        <div className="shrink-0 pt-4 pb-6 px-1">
          <PanelTopControls
            audioRef={audioRef}
            downloading={downloading}
            panelRef={panelRef}
            fadeOutPanel={fadeOutExpandedPanel}
            songId={playingSong._id}
            isLiked={playingSong.isLiked}
            showCloseBtn={false}
          />
          <hr className="border-white/10 mx-4 mb-1" />
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
      </div>
    </div>
  );
};

export default ExpandedPlayer;
