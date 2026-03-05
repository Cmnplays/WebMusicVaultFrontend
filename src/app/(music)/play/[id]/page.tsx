"use client";
import { setPlayingSong } from "@/reduxSlices/song/songSlice";
import { getSongWithId } from "@/services/song.services";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const DemoSongPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const playingSong = useAppSelector((state) => state.song.playingSong);
  useEffect(() => {
    const getSong = async () => {
      const song = await getSongWithId(id as string);
      dispatch(setPlayingSong(song));
      console.log(song);
    };
    getSong();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Song Player Demo</h1>
      <audio controls src={playingSong?.fileUrl}>
        Play
      </audio>
    </div>
  );
};

export default DemoSongPage;
