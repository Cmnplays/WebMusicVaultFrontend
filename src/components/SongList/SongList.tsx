import { useRef, useState } from "react";
import type { Song } from "../../services/song.services";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import SongCard from "./SongCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setEditableSong } from "@/reduxSlices/song.slice";
import { setMountEditSongModal } from "@/reduxSlices/ui.slice";

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
  const loading = useAppSelector((state) => state.ui.loading);
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((state) => state.auth.user?.role) === "admin";

  const hasMoreSongs = useAppSelector(
    (state) => state.song[isTemp ? "tempHasMoreSongs" : "hasMoreSongs"],
  );
  useInfiniteScroll({ isTemp, sentinelRef });

  const virtualizer = useVirtualizer({
    count: songs.length,
    estimateSize: () => 90,
    getScrollElement: () => scrollableElemRef.current,
    overscan: 4,
  });

  const handleEditSong = (song: Song) => {
    dispatch(setMountEditSongModal(true));
    dispatch(setEditableSong({ ...song, isTemp }));
  };

  const [openMenuSongId, setOpenMenuSongId] = useState<string | null>(null);
  const pinnedSongs = useAppSelector((state) => state.song.pinnedSongs);
  const pinnedSongsSet = new Set(pinnedSongs.map((song) => song._id));
  return (
    <div
      ref={scrollableElemRef}
      style={{
        overflow: "auto",
        flex: 1,
        width: "100%",
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
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                zIndex: openMenuSongId === song._id ? 9999 : 1,
              }}
            >
              <SongCard
                handlePlayClick={handlePlayClick}
                song={song}
                isActive={isActive}
                isPlaying={isActive && playing}
                isAdmin={isAdmin}
                handleEditSong={handleEditSong}
                isPinned={pinnedSongsSet.has(song._id)}
                isMenuOpen={openMenuSongId === song._id}
                onMenuToggle={() =>
                  setOpenMenuSongId(
                    openMenuSongId === song._id ? null : song._id,
                  )
                }
                onCloseMenu={() => setOpenMenuSongId(null)}
              />
            </li>
          );
        })}
      </ul>

      <div ref={sentinelRef} className="h-px w-full bg-transparent"></div>

      {/* ── Inline loader (loading more) ── */}
      {loading && songs.length >= 10 && (
        <p className="text-center mt-4 text-purple-200">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin inline-block" />
        </p>
      )}

      {/* ── End of results ── */}
      {!hasMoreSongs && songs.length > 0 && (
        <p className="text-center text-purple-200 mb-2">
          You have reached the end of the results.
        </p>
      )}
    </div>
  );
};

export default SongList;
