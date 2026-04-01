import Navbar from "@/components/Navbar/Navbar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif" }}>
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
