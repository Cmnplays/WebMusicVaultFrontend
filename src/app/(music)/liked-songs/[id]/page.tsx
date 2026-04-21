"use client";
import { useRef, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import {
  setTempSongs,
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
} from "@/reduxSlices/song/songSlice";
import {
  setPlaying,
  setExpandedPanelOpen,
  setExpandedPanelTrigger,
} from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmationModal";
import DownloadConfirmation from "@/components/Modal/DownloadConfirmationModal";
import ShareSongModal from "@/components/Modal/ShareSongModal";
import AuthPromptModal from "@/components/Modal/AuthPromptModal";
import MiniPlayer from "@/components/SongPlayerPanel/MiniPlayer";
import ExpandedPlayer from "@/components/SongPlayerPanel/ExpandedPlayer";
import { getLikedSongs, PlaylistWithSongs } from "@/services/playlist.services";
import { Song } from "@/services/song.services";
import { ArrowLeft } from "lucide-react";

const LikedSongsPage = () => {
  const params = useParams();
  const userId = params?.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);

  const [playlistInfo, setPlaylistInfo] =
    useState<Partial<PlaylistWithSongs> | null>(null);

  const tempSongs = useAppSelector((state) => state.song.tempSongs);
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

  const tempHasMoreSongs = useAppSelector(
    (state) => state.song.tempHasMoreSongs,
  );
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const tempTriggerFetch = useAppSelector(
    (state) => state.song.tempTriggerFetch,
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ audioRef, songs: tempSongs });

  // Clear state on unmount or userId change
  useEffect(() => {
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(true));
      dispatch(setTempNextCursor(undefined));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch, userId]);

  // Initial fetch
  useEffect(() => {
    if (!userId) return;
    const fetchInitialSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getLikedSongs(userId);
        if (data.songs && data.songs.length > 0) {
          dispatch(replaceTempSongs(data.songs as unknown as Song[]));
          dispatch(setTempNextCursor(data.nextCursor));
          dispatch(setTempHasMoreSongs(data.hasMoreSongs));
        } else {
          dispatch(replaceTempSongs([]));
          dispatch(setTempHasMoreSongs(false));
        }
        setPlaylistInfo({
          name: data.name,
          description: data.description,
          isDefault: data.isDefault,
        });
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchInitialSongs();
  }, [dispatch, userId]);

  // Infinite Scroll fetch
  useEffect(() => {
    if (!userId || !tempHasMoreSongs) {
      return;
    }
    const fetchMoreSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getLikedSongs(userId, {
          cursor: tempNextCursor as string,
        });
        if (data.songs && data.songs.length > 0) {
          dispatch(setTempSongs(data.songs as unknown as Song[]));
          dispatch(setTempNextCursor(data.nextCursor));
          dispatch(setTempHasMoreSongs(data.hasMoreSongs));
        } else {
          dispatch(setTempHasMoreSongs(false));
        }
      } catch (error) {
        console.error("Error fetching more songs:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchMoreSongs();
  }, [tempTriggerFetch]);

  return (
    <main
      className={`max-w-5xl mx-auto p-4 pb-32 min-h-screen text-white ${playing && "mb-[192px]"}`}
    >
      {/* Header */}
      <div className="mb-6 bg-white/10 p-6 rounded-lg shadow-lg">
        <button
          onClick={() => router.push("/playlist")}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Playlists</span>
        </button>
        {playlistInfo ? (
          <>
            <h1 className="text-3xl font-bold">{playlistInfo.name}</h1>
            {playlistInfo.description && (
              <p className="text-gray-300 mt-2">{playlistInfo.description}</p>
            )}
          </>
        ) : (
          <div className="h-12 bg-white/20 rounded animate-pulse w-1/3"></div>
        )}
      </div>

      {/* Song List */}
      {loading && tempSongs.length < 10 ? (
        <SongListSkeleton rows={10} />
      ) : (
        <SongList
          handlePlayClick={handlePlayClick}
          playing={playing}
          playingSong={playingSong}
          songs={tempSongs}
          isTemp={true}
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
      {mountDeleteConfirmation && playingSong && (
        <DeleteConfirmation
          title={playingSong.title}
          songId={playingSong._id}
          moveToNextSong={moveToNextSong}
        />
      )}

      {mountDownloadConfirmation && playingSong && (
        <DownloadConfirmation title={playingSong.title} />
      )}

      {mountShareModal && playingSong && (
        <ShareSongModal songId={playingSong._id} title={playingSong.title} />
      )}
      {mountAuthPromptModal && playingSong && <AuthPromptModal />}

      {loading && tempSongs.length >= 10 && (
        <p className="text-center mt-4 text-purple-200 whitespace-pre-line">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin inline-block" />
        </p>
      )}

      {!tempHasMoreSongs && tempSongs.length > 0 && (
        <p className="text-center mt-4 text-purple-200">
          You have reached the end of the playlist.
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

export default LikedSongsPage;
