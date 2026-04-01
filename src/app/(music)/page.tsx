"use client";
import React, { useRef, useEffect } from "react";
import SongPlayerPanel from "@/components/SongPlayerPanel/index";
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
  setPlayingSong,
  setExpandedPanelTrigger,
  setMiniPanelOpen,
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
      dispatch(setPlaying(false));
      dispatch(setPlayingSong(null));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setMiniPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  return (
    <main
      className={`max-w-5xl mx-auto p-3 min-h-screen ${playing && "mb-[200px]"}`}
      style={{ fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif" }}
    >
      {/* Header */}
      <MusicHeader
        HandleSortBy={(sortBy)=>handleSortBy(sortBy,dispatch)}
        HandleSortOrder={(sortOrder)=>handleSortOrder(sortOrder,dispatch)}
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
      <div className="fixed bottom-16 lg:bottom-6 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-[540px] z-[60]">
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
        <div className="win-window mt-4 p-4 max-w-md mx-auto">
          <div className="win-titlebar">
            <span className="text-[11px] font-bold">Error</span>
          </div>
          <div className="bg-[#d4d0c8] p-3 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-[11px] text-black leading-relaxed">
              {statusText}
            </p>
          </div>
          <div className="bg-[#d4d0c8] border-t border-[#808080] p-2 flex justify-center">
            <button className="win-raised bg-[#d4d0c8] px-6 py-1 text-[11px] text-black cursor-default active:win-pressed">
              OK
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="win-window p-4">
            <div className="bg-[#d4d0c8] flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-[#0a246a] border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] text-black">Loading songs...</span>
            </div>
          </div>
        </div>
      )}

      {!hasMoreSongs && songs.length > 0 && (
        <div className="win-panel p-2 mt-4 max-w-md mx-auto text-center">
          <p className="text-[11px] text-black">
            End of list.
          </p>
        </div>
      )}

      {(downloading || deleting) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="win-window p-4">
            <div className="bg-[#d4d0c8] flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-[#0a246a] border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] text-black">
                {downloading && "Downloading..."}
                {deleting && "Deleting..."}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MusicPage;
