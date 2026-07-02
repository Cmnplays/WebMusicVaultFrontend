import Navbar from "@/components/Navbar/Navbar";
import SongPlayerCombined from "@/components/SongPlayerPanel/SongPlayerCombined";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#5520A5] flex flex-col h-screen">
      <Navbar />
      <main
        className={`flex-1 flex flex-col h-screen overflow-hidden max-w-5xl mx-auto w-full p-4 pb-1 text-white`}
      >
        {children}
      </main>
      <SongPlayerCombined />
      <ScrollToTopButton />
    </div>
  );
}
