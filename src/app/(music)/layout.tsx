import Navbar from "@/components/Navbar/Navbar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#5520A5]">
      <Navbar />
      {children}
    </div>
  );
}
