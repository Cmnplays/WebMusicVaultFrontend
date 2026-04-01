"use client";
import { useRef } from "react";
import type { Song } from "../../services/song.services";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import SongCard from "./SongCard";

const SongList = ({
  songs,
  handlePlayClick,
  playingSong,
  playing,
  isTemp = false,
}: {
  songs: Song[];
  handlePlayClick: (song: Song) => void;
  playingSong: Song | null;
  playing: boolean;
  isTemp?: boolean;
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useInfiniteScroll({ isTemp, sentinelRef });

  return (
    /* Win2K ListView panel */
    <div className="win-window overflow-hidden">
      {/* Column header row */}
      <div className="flex items-stretch bg-[#d4d0c8]" style={{ borderBottom: '2px solid #808080' }}>
        {/* Icon col */}
        <div className="w-8 flex-shrink-0 win-raised bg-[#d4d0c8] px-1 py-0.5 text-[11px] text-black font-bold border-r border-[#808080]" />
        {/* Title col */}
        <div className="flex-1 win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black font-bold border-r border-[#808080] flex items-center gap-1 cursor-default">
          <span>Title</span>
          <span className="text-[9px] text-[#808080]">▲</span>
        </div>
        {/* Artist col */}
        <div className="w-32 hidden sm:flex win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black font-bold border-r border-[#808080] items-center cursor-default">
          Artist
        </div>
        {/* Duration col */}
        <div className="w-14 flex-shrink-0 win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black font-bold text-right cursor-default">
          Time
        </div>
      </div>

      {/* Song rows */}
      <div className="win-sunken bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
        <ul>
          {songs.map((song) => {
            const isCurrentSongPlaying = playingSong?._id === song._id && playing;
            return (
              <SongCard
                key={song._id}
                handlePlayClick={handlePlayClick}
                song={song}
                isCurrentSongPlaying={isCurrentSongPlaying}
              />
            );
          })}
        </ul>
        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-px w-full bg-transparent" />
      </div>

      {/* Status bar at bottom of list */}
      <div className="win-statusbar text-[11px] text-black flex items-center gap-4 px-2 py-0.5"
           style={{ borderTop: '1px solid #808080' }}>
        <div className="win-sunken px-2 py-0.5 flex-1">
          {songs.length} object{songs.length !== 1 ? "s" : ""}
        </div>
        <div className="win-sunken px-2 py-0.5">
          {playing ? "▶ Playing" : "Ready"}
        </div>
      </div>
    </div>
  );
};

export default SongList;
