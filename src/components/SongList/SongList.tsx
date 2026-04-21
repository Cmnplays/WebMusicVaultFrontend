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
    <div>
      <ul className="space-y-4">
        {songs.map((song) => {
          const isActive = playingSong?._id === song._id;

          return (
            <SongCard
              key={song._id}
              handlePlayClick={handlePlayClick}
              song={song}
              isActive={isActive}
              isPlaying={isActive && playing}
            />
          );
        })}
      </ul>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-px w-full bg-transparent"></div>
    </div>
  );
};

export default SongList;
