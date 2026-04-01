"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import AddToFav from "@/components/SongPlayerPanel/PanelButtons/AddToFav";
import Image from "next/image";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fadeInMiniPlayer, fadeOutMiniPlayer } from "@/lib/animations";
import { setPlaying, setPlayingSong } from "@/reduxSlices/player/playerSlice";

interface MiniPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handlePlayPause: () => void;
  onExpand: () => void;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MiniPlayer = ({
  audioRef,
  handlePlayPause,
  onExpand,
}: MiniPlayerProps) => {
  const dispatch = useAppDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const playingSong = useAppSelector((state) => state.player.playingSong);
  const playing = useAppSelector((state) => state.player.playing);
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const duration = useAppSelector((state) => state.player.duration);
  const miniPanelOpen = useAppSelector((state) => state.player.miniPanelOpen);

  const isMount = useRef(true);

  useEffect(() => {
    if (!panelRef.current) return;
    if (isMount.current) {
      isMount.current = false;
      if (!miniPanelOpen) {
        gsap.set(panelRef.current, { y: "100%", opacity: 0 });
      } else {
        fadeInMiniPlayer(panelRef.current);
      }
      return;
    }
    if (miniPanelOpen) {
      fadeInMiniPlayer(panelRef.current);
    } else {
      fadeOutMiniPlayer(panelRef.current, () => {
        dispatch(setPlayingSong(null));
        dispatch(setPlaying(false));
      });
    }
  }, [miniPanelOpen, dispatch]);

  if (!playingSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  const fmtTime = (s: number) => `${pad(s / 60)}:${pad(s % 60)}`;

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative w-full cursor-default select-none",
        !miniPanelOpen && "opacity-0 translate-y-full pointer-events-none",
      )}
    >
      {/* Win2K media player window */}
      <div className="win-window mx-2 mb-2 overflow-hidden" style={{ fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif" }}>
        {/* Title bar */}
        <div className="win-titlebar" onClick={onExpand}>
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="white">
            <path d="M6 2v8.27A3 3 0 1 0 8 13V5h3V2H6z"/>
          </svg>
          <span className="text-[11px] font-bold truncate flex-1">
            Windows Media Player — {playingSong.title.replace(".mp3", "")}
          </span>
          <div className="flex items-center gap-0.5 ml-2">
            <button className="win-raised w-[16px] h-[14px] text-[9px] font-bold text-black bg-[#d4d0c8] flex items-center justify-center leading-none">_</button>
            <button className="win-raised w-[16px] h-[14px] text-[9px] font-bold text-black bg-[#d4d0c8] flex items-center justify-center leading-none">□</button>
            <button className="win-raised w-[16px] h-[14px] text-[9px] font-bold text-black bg-[#d4d0c8] flex items-center justify-center leading-none">✕</button>
          </div>
        </div>

        {/* Player body */}
        <div className="bg-[#d4d0c8] p-2 flex items-center gap-2">
          {/* Album art */}
          <div className="win-sunken w-12 h-12 flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
            {playingSong.coverImageUrl ? (
              <Image
                src={playingSong.coverImageUrl}
                alt={playingSong.title}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <svg className="w-6 h-6 text-[#008080]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/>
              </svg>
            )}
          </div>

          {/* Track info + progress */}
          <div className="flex-1 min-w-0">
            {/* Track name — Win2K LCD-style readout */}
            <div className="win-sunken bg-black px-2 py-0.5 mb-1">
              <p className="text-[#00cc00] text-[11px] font-mono truncate">
                {playingSong.title.replace(".mp3", "")}
              </p>
              <p className="text-[#009900] text-[10px] font-mono truncate">
                {playingSong.artist || "Unknown Artist"}
              </p>
            </div>

            {/* Progress bar — Win2K style */}
            <div className="win-sunken bg-[#000080] h-3 relative cursor-pointer"
                 title={`${fmtTime(currentTime)} / ${fmtTime(duration)}`}>
              <div
                className="h-full bg-[#00aaff] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              {/* Progress thumb */}
              <div
                className="absolute top-0 h-full w-3 bg-[#d4d0c8]"
                style={{ left: `calc(${progress}% - 6px)`, borderLeft: '1px solid #ffffff', borderRight: '1px solid #808080' }}
              />
            </div>

            {/* Time readout */}
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] font-mono text-black">{fmtTime(currentTime)}</span>
              <span className="text-[10px] font-mono text-black">{fmtTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Controls bar */}
        <div className="bg-[#d4d0c8] border-t border-[#808080] px-2 py-1.5 flex items-center gap-1"
             onClick={(e) => e.stopPropagation()}>
          {/* Previous */}
          <button
            className="win-raised bg-[#d4d0c8] w-8 h-7 flex items-center justify-center text-black text-[10px] cursor-default active:win-pressed"
            title="Previous"
          >
            ◀◀
          </button>

          {/* Play / Pause */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
            className="win-raised bg-[#d4d0c8] w-10 h-7 flex items-center justify-center text-black text-sm cursor-default active:win-pressed font-bold"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* Stop */}
          <button
            className="win-raised bg-[#d4d0c8] w-8 h-7 flex items-center justify-center text-black text-[10px] cursor-default active:win-pressed"
            title="Stop"
          >
            ■
          </button>

          {/* Next */}
          <button
            className="win-raised bg-[#d4d0c8] w-8 h-7 flex items-center justify-center text-black text-[10px] cursor-default active:win-pressed"
            title="Next"
          >
            ▶▶
          </button>

          <div className="w-px h-5 bg-[#808080] mx-1" />

          {/* Favorite / Add */}
          <div className="win-raised bg-[#d4d0c8] h-7 flex items-center px-1 cursor-default">
            <AddToFav
              songId={playingSong._id}
              isLiked={playingSong.isLiked}
              audioRef={audioRef}
            />
          </div>

          <div className="flex-1" />

          {/* Expand button */}
          <button
            onClick={onExpand}
            className="win-raised bg-[#d4d0c8] px-2 h-7 flex items-center gap-1 text-[11px] text-black cursor-default active:win-pressed"
            title="Open full player"
          >
            <span>▲</span>
            <span className="hidden sm:inline">Open</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
