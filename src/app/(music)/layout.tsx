import Navbar from "@/components/Navbar/Navbar";
import SongPlayerCombined from "@/components/SongPlayerPanel/SongPlayerCombined";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#5520A5]">
      <Navbar />
      {children}
      <SongPlayerCombined />
    </div>
  );
}
