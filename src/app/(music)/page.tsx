"use client";
import React, { useRef, useEffect } from "react";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useSongs } from "@/hooks/useSongs";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import MusicHeader from "@/components/MusicPage/MusicPageHeader";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import { setTempSongs } from "@/reduxSlices/song/songSlice";
import {
  setPlaying,
  setExpandedPanelOpen,
  setExpandedPanelTrigger,
} from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import ShareSongModal from "@/components/Modal/ShareSongModal";
import AuthPromptModal from "@/components/Modal/AuthPromptModal";
import MiniPlayer from "@/components/SongPlayerPanel/MiniPlayer";
import ExpandedPlayer from "@/components/SongPlayerPanel/ExpandedPlayer";
import { handleSortBy, handleSortOrder } from "@/utils/songUtils";

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

  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ audioRef, songs });

  const { error } = useSongs();

  //for reseting some states when the page changes
  useEffect(() => {
    return () => {
      dispatch(setTempSongs([]));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  return (
    <main
      className={`max-w-5xl mx-auto p-4 min-h-screen text-white ${playing && "mb-[192px]"}`}
    >
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

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />

      {/* ── MiniPlayer ── */}
      <div className="fixed bottom-16 lg:bottom-6 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-[500px] z-[60] lg:rounded-2xl lg:overflow-hidden lg:shadow-[0_-4px_30px_rgba(0,0,0,0.5)] lg:border lg:border-purple-500/20">
        <MiniPlayer
          audioRef={audioRef}
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
          onExpand={() => {
            dispatch(setExpandedPanelTrigger());
            dispatch(setExpandedPanelOpen(true));
          }}
        />
      </div>

      <ExpandedPlayer
        audioRef={audioRef}
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
