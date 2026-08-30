"use client";
import Navbar from "@/components/Navbar/Navbar";
import SongPlayerCombined from "@/components/SongPlayerPanel/SongPlayerCombined";
import { useAppSelector } from "@/store/hook";
import EditSongModal from "@/components/Modal/EditSongModal";
import CreatePlaylistModal from "@/components/Modal/CreatePlaylistModal";
import AddToPlaylistModal from "@/components/Modal/AddToPlaylistModal";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = useAppSelector((state) => state.auth.user?.role) === "admin";
  return (
    <div className="bg-[#5520A5] flex flex-col h-screen">
      <Navbar />
      <main
        className={`flex-1 flex flex-col min-h-0 overflow-hidden max-w-5xl mx-auto w-full p-2 text-white transition-all duration-300 pb-16 lg:pb-4`}
      >
        {children}
      </main>
      {isAdmin && <EditSongModal />}
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <SongPlayerCombined />
    </div>
  );
}
