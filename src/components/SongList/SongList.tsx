"use client";
import { useRef } from "react";
import type { Song } from "../../services/song.services";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import SongCard from "./SongCard";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollableElemRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll({ isTemp, sentinelRef });

  const virtualizer = useVirtualizer({
    count: songs.length,
    estimateSize: () => 90,
    getScrollElement: () => scrollableElemRef.current,
    overscan: 4,
  });
  return (
    <div
      ref={scrollableElemRef}
      style={{
        overflow: "auto",
        height: "100%",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <ul
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const song = songs[virtualItem.index];
          const isActive = playingSong?._id === song._id;

          return (
            <li
              key={song._id}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <SongCard
                handlePlayClick={handlePlayClick}
                song={song}
                isActive={isActive}
                isPlaying={isActive && playing}
              />
            </li>
          );
        })}
      </ul>
      <div ref={sentinelRef} className="h-px w-full bg-transparent"></div>
    </div>
  );
};

export default SongList;
