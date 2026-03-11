"use client";
import React, { useRef, useEffect } from "react";
import SongPlayerPanel from "@/components/SongPlayerPanel/index";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useSongs } from "@/hooks/useSongs";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { fadeOutPanel } from "@/hooks/useAudioPlayer";
import MusicHeader from "@/components/MusicPage/MusicPageHeader";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { setTempSongs } from "@/reduxSlices/song/songSlice";
import {
  setPlaying,
  setPanelOpen,
  setPlayingSong,
} from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import ShareSongModal from "@/components/Modal/ShareSongModal";
import AuthPromptModal from "@/components/Modal/AuthPromptModal";
import { showToast, showToastProps } from "@/hooks/useToast";

const MusicPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const statusText = useAppSelector((state) => state.ui.statusText);
  const songs = useAppSelector((state) => state.song.songs);
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);

  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.ui.mountDeleteConfirmation,
  );
  const mountDownloadConfirmation = useAppSelector(
    (state) => state.ui.mountDownloadConfirmation,
  );
  const mountShareModal = useAppSelector((state) => state.ui.mountShareModal);
  const mountAuthPromptModal = useAppSelector(
    (state) => state.ui.mountAuthPromptModal,
  );

  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const sortBy = useAppSelector((state) => state.song.sortBy);
  const hasMoreSongs = useAppSelector((state) => state.song.hasMoreSongs);

  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toast = useAppSelector((state) => state.ui.toast);

  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ panelRef, audioRef, songs });

  const { error, handleSortBy, handleSortOrder } = useSongs(panelRef);

  //for reseting some states when the page changes
  useEffect(() => {
    return () => {
      dispatch(setTempSongs([]));
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  //toast messages
  useEffect(() => {
    showToast(toast as showToastProps);
  }, [toast]);
  return (
    <main
      className={`max-w-5xl mx-auto p-4 text-white ${playing && "mb-[192px]"}`}
    >
      {/* Header */}
      <MusicHeader
        HandleSortBy={handleSortBy}
        HandleSortOrder={handleSortOrder}
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
          audioRef={audioRef}
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

      {mountDownloadConfirmation && (
        <DownloadConfirmation title={playingSong!.title} />
      )}

      {mountShareModal && playingSong && (
        <ShareSongModal songId={playingSong._id} title={playingSong.title} />
      )}
      {mountAuthPromptModal && playingSong && <AuthPromptModal />}

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
    </main>
  );
};

export default MusicPage;
