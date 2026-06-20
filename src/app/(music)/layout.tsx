"use client";
import { useAppSelector } from "@/store/hook";
import Navbar from "@/components/Navbar/Navbar";
import SongPlayerCombined from "@/components/SongPlayerPanel/SongPlayerCombined";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const playingSong = useAppSelector((state) => state.player.playingSong);

  return (
    <div className="bg-[#5520A5] flex flex-col h-screen">
      <Navbar />
      <main
        className={`flex-1 overflow-hidden max-w-5xl mx-auto w-full p-4 text-white transition-all duration-300 ${
          playingSong ? "pb-48" : "pb-32"
        }`}
      >
        {children}
      </main>
      <SongPlayerCombined />
      <ScrollToTopButton />
    </div>
  );
}
