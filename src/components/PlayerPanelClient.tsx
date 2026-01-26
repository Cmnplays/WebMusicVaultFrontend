"use client";

import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import SongPlayerPanel from "@/components/SongPlayerPanel";
import { useAudioPlayer, fadeOutPanel } from "@/hooks/useAudioPlayer";
import {
  setPlaying,
  setPlayingSong,
  setPanelOpen,
} from "@/reduxSlices/song/songSlice";
import type { Song } from "@/services/song.services";
interface PlayerPanelClientProps {
  songs: Song[]; // adjust type if you have a Song type
}

export default function PlayerPanelClient({ songs }: PlayerPanelClientProps) {
  const dispatch = useAppDispatch();
  const playing = useAppSelector((state) => state.song.playing);
  const playingSong = useAppSelector((state) => state.song.playingSong);

  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { handleAudioEnded, moveToNextSong, moveToPreviousSong } =
    useAudioPlayer({
      audioRef,
      panelRef,
      songs,
    });

  const handlePlayPause = () => {
    if (!playing) {
      if (!playingSong && songs.length > 0) {
        dispatch(setPlayingSong(songs[0]));
      }
      audioRef.current?.play();
      dispatch(setPlaying(true));
      dispatch(setPanelOpen(true));
      return;
    }
    audioRef.current?.pause();
    dispatch(setPlaying(false));
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-5xl z-50">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />
      <SongPlayerPanel
        audioRef={audioRef}
        panelRef={panelRef}
        handlePlayPause={handlePlayPause}
        moveToNextSong={moveToNextSong}
        moveToPreviousSong={moveToPreviousSong}
        fadeOutPanel={fadeOutPanel}
      />
    </div>
  );
}
