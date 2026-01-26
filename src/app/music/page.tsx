"use client";
import React, { useRef, useEffect } from "react";
import SongPlayerPanel from "@/components/SongPlayerPanel";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useSongs } from "@/hooks/useSongs";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { fadeOutPanel } from "@/hooks/useAudioPlayer";
import MusicHeader from "@/components/MusicPageComponents/MusicHeader";
import SongList from "@/components/SongList";
import {
  setTempSongs,
  setPlaying,
  setPanelOpen,
  setPlayingSong,
  setLoading,
} from "@/reduxSlices/song/songSlice";
import DownloadConfirmation from "@/components/DownloadConfirmation";

const MusicPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const statusText = useAppSelector((state) => state.song.statusText);
  const songs = useAppSelector((state) => state.song.songs);
  const loading = useAppSelector((state) => state.song.loading);
  const playing = useAppSelector((state) => state.song.playing);
  const downloading = useAppSelector((state) => state.song.downloading);
  const deleting = useAppSelector((state) => state.song.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.song.mountDeleteConfirmation,
  );
  const mountDownloadConfirmation = useAppSelector(
    (state) => state.song.mountDownloadConfirmation,
  );
  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const hasMoreSongs = useAppSelector((state) => state.song.hasMoreSongs);
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ panelRef, audioRef, songs });
  const { error, handleSorting } = useSongs(panelRef);
  useEffect(() => {
    return () => {
      dispatch(setTempSongs([]));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);
  return (
    <main
      className={`max-w-5xl mx-auto p-4 text-white ${playing && "mb-[192px]"}`}
    >
      {/* Header */}
      <MusicHeader handleSorting={handleSorting} sortOrder={sortOrder} />

      {/* Song List */}
      <SongList
        handlePlayClick={handlePlayClick}
        playing={playing}
        playingSong={playingSong}
        songs={songs}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />

      {/* Player Panel */}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-5xl z-50">
        <SongPlayerPanel
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
          panelRef={panelRef}
          fadeOutPanel={fadeOutPanel}
          handlePlayPause={async () => {
            if (!playing) {
              try {
                await audioRef.current?.play();
                dispatch(setPlaying(true));
              } catch (err) {
                console.warn("Audio play was interrupted", err);
              }
              return;
            }
            audioRef.current?.pause();
            dispatch(setPlaying(false));
          }}
          moveToNextSong={moveToNextSong}
          moveToPreviousSong={moveToPreviousSong}
        />
      </div>

      {/* Delete Confirmation */}
      {mountDeleteConfirmation && (
        <DeleteConfirmation
          title={playingSong!.title}
          songId={playingSong!._id}
          moveToNextSong={moveToNextSong}
        />
      )}

      {/* Download Confirmation */}
      {mountDownloadConfirmation && (
        <DownloadConfirmation title={playingSong!.title} />
      )}

      {/* Loading / Error */}
      {(loading || error) && (
        <p className="text-center mt-4 text-purple-200 whitespace-pre-line">
          {statusText}
        </p>
      )}

      {/* End of List */}
      {!hasMoreSongs && (
        <p className="text-center mt-4 text-purple-200">
          You have reached the end of the list.
        </p>
      )}

      {/* Global Loader */}
      {(downloading || deleting || loading) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}
    </main>
  );
};

export default MusicPage;
