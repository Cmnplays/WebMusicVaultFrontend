"use client";

import { useRef } from "react";
import SongPlayerPanel from "@/components/SongPlayerPanel/SongPlayerPanel";

const DemoSongPage = () => {
  // dummy audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // dummy functions
  const handlePlayPause = () => console.log("Play/Pause clicked");
  const moveToNextSong = () => console.log("Next song");
  const moveToPreviousSong = () => console.log("Previous song");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Song Player Demo</h1>

      {/* Dummy audio element */}
      <audio ref={audioRef} src="/sample-audio.mp3" controls className="mb-8" />

      {/* Song Player Panel */}
      <SongPlayerPanel
        audioRef={audioRef}
        panelRef={panelRef}
        handlePlayPause={handlePlayPause}
        moveToNextSong={moveToNextSong}
        moveToPreviousSong={moveToPreviousSong}
      />
    </div>
  );
};

export default DemoSongPage;
