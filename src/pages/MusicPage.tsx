import React, { useRef } from "react";
import SongPlayerPanel from "../components/MusicPageComponents/SongPlayerPanel";
import DeleteConfirmation from "../components/MusicPageComponents/DeleteConfirmation";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { useSongs } from "../hooks/useSongs";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { fadeOutPanel } from "../hooks/useAudioPlayer";
import { setPlaying } from "../reduxSlices/song/songSlice";
import MusicHeader from "../components/MusicPageComponents/MusicHeader";
import SongList from "../components/MusicPageComponents/SongList";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
const MusicPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const statusText = useAppSelector((state) => state.song.statusText);
  const songs = useAppSelector((state) => state.song.songs);
  const loading = useAppSelector((state) => state.song.loading);
  const playing = useAppSelector((state) => state.song.playing);
  const downloading = useAppSelector((state) => state.song.downloading);
  const deleting = useAppSelector((state) => state.song.deleting);
  const mountDeleteConfirmation = useAppSelector(
    (state) => state.song.mountDeleteConfirmation
  );
  const sortOrder = useAppSelector((state) => state.song.sortOrder);
  const playingSong = useAppSelector((state) => state.song.playingSong);
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    handlePlayClick,
    handleAudioEnded,
    moveToNextSong,
    moveToPreviousSong,
  } = useAudioPlayer({ panelRef, audioRef });
  const { error, handleSorting, hasMoreSongs } = useSongs();
  useInfiniteScroll({ hasMoreSongs });
  return (
    <main className={`max-w-5xl mx-auto p-4 ${playing && "mb-[192px]"}`}>
      <MusicHeader handleSorting={handleSorting} sortOrder={sortOrder} />
      <SongList
        handlePlayClick={handlePlayClick}
        playing={playing}
        playingSong={playingSong}
        songs={songs}
      />
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />

      {(loading || error) && (
        <p className="text-center mt-4 text-gray-600 whitespace-pre-line">
          {statusText}
        </p>
      )}
      {!hasMoreSongs && (
        <p className="text-center mt-4 text-gray-600">
          You have reached the end of the list.
        </p>
      )}
      {playingSong && (
        <SongPlayerPanel
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
          panelRef={panelRef}
          fadeOutPanel={fadeOutPanel}
          handlePlayPause={() => {
            if (!playing) {
              audioRef.current?.play();
              dispatch(setPlaying(true));
              return;
            }
            audioRef.current?.pause();
            dispatch(setPlaying(false));
          }}
          moveToNextSong={moveToNextSong}
          moveToPreviousSong={moveToPreviousSong}
        />
      )}
      {mountDeleteConfirmation && (
        <DeleteConfirmation
          title={playingSong!.title}
          songId={playingSong!._id}
          moveToNextSong={moveToNextSong}
        />
      )}
      {(downloading || deleting || loading) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </main>
  );
};

export default MusicPage;
