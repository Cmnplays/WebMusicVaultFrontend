"use client";
import Navbar from "@/components/Navbar/Navbar";
import SongPlayerCombined from "@/components/SongPlayerPanel/SongPlayerCombined";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useAppSelector } from "@/store/hook";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const playingSong = useAppSelector((state) => state.player.playingSong);

  return (
    <div className="bg-[#5520A5] flex flex-col h-screen">
      <Navbar />
      <main
        className={`flex-1 flex flex-col min-h-0 overflow-hidden max-w-5xl mx-auto w-full p-4 text-white ${
          playingSong ? "pb-32 md:pb-24" : "pb-16 md:pb-4"
        }`}
      >
        {children}
      </main>
      <SongPlayerCombined />
      <ScrollToTopButton />
    </div>
  );
}
