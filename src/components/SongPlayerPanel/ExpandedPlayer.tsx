"use client";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hook";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { Vibrant } from "node-vibrant/browser";
import { useHandleSliderChange } from "@/components/useHandleSliderChange";
import SongTitleMarquee from "@/components/SongPlayerPanel/SongTitleMarquee";
import ProgressSlider from "@/components/SongPlayerPanel/ProgressSlider";
import PanelBottomControls from "@/components/SongPlayerPanel/PanelBottomControls";
import PanelTopControls from "@/components/SongPlayerPanel/PanelTopControls";
import Image from "next/image";

interface ExpandedPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handlePlayPause: () => void;
  moveToNextSong: () => void;
  moveToPreviousSong: () => void;
  isExpanded: boolean;
  onCollapse: () => void;
}

const ExpandedPlayer = ({
  audioRef,
  handlePlayPause,
  moveToNextSong,
  moveToPreviousSong,
  isExpanded,
  onCollapse,
}: ExpandedPlayerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState("#1a0635");

  const playingSong = useAppSelector((state) => state.player.playingSong);
  const playing = useAppSelector((state) => state.player.playing);
  const duration = useAppSelector((state) => state.player.duration);
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const repeat = useAppSelector((state) => state.player.repeat);
  const shuffle = useAppSelector((state) => state.player.shuffle);
  const downloading = useAppSelector((state) => state.ui.downloading);

  const handleSliderChange = useHandleSliderChange(audioRef);

  // Extract dominant color from cover image
  useEffect(() => {
    let mounted = true;
    if (!playingSong?.coverImageUrl) return;

    Vibrant.from(playingSong.coverImageUrl)
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

    return () => {
      mounted = false;
    };
  }, [playingSong?.coverImageUrl]);

  // Animate in/out based on isExpanded
  useEffect(() => {
    if (!panelRef.current) return;
    if (isExpanded) {
      gsap.fromTo(
        panelRef.current,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          pointerEvents: "all",
        },
      );
    } else {
      gsap.to(panelRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        pointerEvents: "none",
      });
    }
  }, [isExpanded]);

  const handleCollapse = () => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      y: "100%",
      opacity: 0,
      duration: 0.35,
      ease: "power3.in",
      pointerEvents: "none",
      onComplete: onCollapse,
    });
  };

  return (
    <div
      ref={panelRef}
      style={{
        transform: "translateY(100%)",
        opacity: 0,
        pointerEvents: "none",
        backgroundColor: bgColor,
        transition: "background-color 0.8s ease",
      }}
      className="fixed inset-0 z-[100] flex flex-col text-white"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-10 pb-2 shrink-0">
          <button
            onClick={handleCollapse}
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
        <div className="flex-1 flex items-center justify-center px-6 py-4 min-h-0">
          <div className="relative w-full h-full max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-gradient-to-tr from-purple-800 via-purple-600 to-orange-400/60">
            {playingSong?.coverImageUrl ? (
              <Image
                src={playingSong.coverImageUrl}
                alt={playingSong.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <svg
                  className="w-16 h-16 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Player controls */}
        {playingSong && (
          <div className="shrink-0 bg-gradient-to-t from-black/60 to-transparent pt-4 pb-6 px-1">
            <PanelTopControls
              audioRef={audioRef}
              downloading={downloading}
              panelRef={panelRef}
              fadeOutPanel={(_el, cb) => {
                gsap.to(panelRef.current!, {
                  y: "100%",
                  opacity: 0,
                  duration: 0.35,
                  ease: "power3.in",
                  onComplete: () => {
                    cb?.();
                    onCollapse();
                  },
                });
              }}
              songId={playingSong._id}
              isLiked={playingSong.isLiked}
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
        )}
      </div>
    </div>
  );
};

export default ExpandedPlayer;
