"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { usePlaySong } from "@/hooks/usePlaySong";
import SongList from "@/components/SongList/SongList";
import SongListSkeleton from "@/components/SongList/SongListSkeleton";
import {
  setTempSongs,
  replaceTempSongs,
  setTempHasMoreSongs,
  setTempNextCursor,
  setSongsType
} from "@/reduxSlices/song/songSlice";
import {
  setExpandedPanelOpen,
} from "@/reduxSlices/player/playerSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import {
  getPlaylistSongs,
  PlaylistWithSongs,
} from "@/services/playlist.services";
import { Song } from "@/services/song.services";
import { ArrowLeft } from "lucide-react";
import ProtectedLayout from "@/components/ProtectedLayout";

const PlaylistPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [playlistInfo, setPlaylistInfo] =
    useState<Partial<PlaylistWithSongs> | null>(null);
  const tempSongs = useAppSelector((state) => state.song.tempSongs);
  const loading = useAppSelector((state) => state.ui.loading);
  const playing = useAppSelector((state) => state.player.playing);
  const playingSong = useAppSelector((state) => state.player.playingSong);

  const downloading = useAppSelector((state) => state.ui.downloading);
  const deleting = useAppSelector((state) => state.ui.deleting);

  const tempHasMoreSongs = useAppSelector(
    (state) => state.song.tempHasMoreSongs,
  );
  const tempNextCursor = useAppSelector((state) => state.song.tempNextCursor);
  const tempTriggerFetch = useAppSelector(
    (state) => state.song.tempTriggerFetch,
  );

  const { handlePlayClick } = usePlaySong();

  // Clear state on unmount or id change
  useEffect(() => {
    dispatch(setSongsType("tempSongs"));
    return () => {
      dispatch(replaceTempSongs([]));
      dispatch(setTempHasMoreSongs(true));
      dispatch(setTempNextCursor(undefined));
      dispatch(setExpandedPanelOpen(false));
      dispatch(setLoading(false));
    };
  }, [dispatch, id]);

  // Initial fetch
  useEffect(() => {
    if (!id) return;
    const fetchInitialSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getPlaylistSongs(id, { limit: 10 });
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
          owner: data.owner,
          description: data.description,
          isDefault: data.isDefault,
        });
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchInitialSongs();
  }, [dispatch, id]);

  // Infinite Scroll fetch
  useEffect(() => {
    if (!id || !tempNextCursor || !tempHasMoreSongs) return;

    const fetchMoreSongs = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getPlaylistSongs(id, {
          limit: 10,
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
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMoreSongs();
  }, [tempTriggerFetch]);

  return (
    <ProtectedLayout>
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
    </ProtectedLayout>
  );
};

export default PlaylistPage;
