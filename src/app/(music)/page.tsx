"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useSongs } from "@/hooks/useSongs";
import { usePlaySong } from "@/hooks/usePlaySong";
import { setSongsType } from "@/reduxSlices/song.slice";
import {
  setExpandedPanelOpen,
  setPlayingSong,
  setPlaying,
  setMiniPanelOpen,
} from "@/reduxSlices/player.slice";
import { setLoading } from "@/reduxSlices/ui.slice";
import MusicHeader from "@/components/MusicPage/MusicPageHeader";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { handleSortBy, handleSortOrder } from "@/utils/songUtils";
import { useSearchParams, useRouter } from "next/navigation";
import { getSongWithId } from "@/services/song.services";

const MusicPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const statusText = useAppSelector((state) => state.ui.statusText);
  const songs = useAppSelector((state) => state.song.songs);
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);

  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);

  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const sortBy = useAppSelector((state) => state.song.sortBy);
  const hasMoreSongs = useAppSelector((state) => state.song.hasMoreSongs);
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);

  const { handlePlayClick } = usePlaySong();
  const { error } = useSongs();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Reset/Set states when the page changes
  useEffect(() => {
    document.title = "Music Collection | WmV";
    dispatch(setSongsType("songs"));
    return () => {
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  useEffect(() => {
    const songId = searchParams?.get("song");
    if (!songId || shouldFetchUser) return;

    const fetchAndPlay = async () => {
      try {
        const song = await getSongWithId(songId);
        dispatch(setPlayingSong(song));
        dispatch(setPlaying(true));
        dispatch(setMiniPanelOpen(true));
      } catch (err) {
        console.error("Deep-link: failed to fetch song", err);
      } finally {
        router.replace("/", { scroll: false });
      }
    };

    fetchAndPlay();
  }, [shouldFetchUser, searchParams, dispatch, router]);

  return (
    <>
      {/* Header */}
      <MusicHeader
        HandleSortBy={(sortBy) => handleSortBy(sortBy, dispatch)}
        HandleSortOrder={(sortOrder) => handleSortOrder(sortOrder, dispatch)}
        sortOrder={sortOrder}
        sortBy={sortBy}
      />

      {/* Song List */}
      {loading && songs.length < 10 ? (
        <SongListSkeleton rows={10} />
      ) : (
        <SongList
          handlePlayClick={handlePlayClick}
          playing={playing}
          playingSong={playingSong}
          songs={songs}
        />
      )}

      {error && (
        <p className="text-center mt-4 text-purple-200 whitespace-pre-line">
          {statusText}
        </p>
      )}

      {loading && (
        <p className="text-center mt-4 text-purple-200 whitespace-pre-line">
          {/* Inline loader */}
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin inline-block" />
        </p>
      )}

      {!hasMoreSongs && (
        <p className="text-center mt-4 text-purple-200">
          You have reached the end of the list.
        </p>
      )}

      {(downloading || deleting) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}
    </>
  );
};

export default MusicPage;
