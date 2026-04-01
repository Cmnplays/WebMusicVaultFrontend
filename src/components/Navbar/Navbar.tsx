"use client";
import { useState, useRef, useLayoutEffect } from "react";
import { setNavHeight } from "@/reduxSlices/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout } from "@/services/auth.services";
import { clearAuth } from "@/reduxSlices/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const desktopRoutes = [
  { name: "Music", to: "/" },
  { name: "Playlist", to: "/playlist" },
  { name: "Search", to: "/search" },
  { name: "Shuffle", to: "/shuffle" },
  { name: "Upload", to: "/upload" },
  { name: "About", to: "/about" },
  { name: "Account", to: "/me" },
];

const mobileRoutes = [
  { name: "Music", to: "/" },
  { name: "Playlist", to: "/playlist" },
  { name: "Search", to: "/search" },
  { name: "Shuffle", to: "/shuffle" },
  { name: "Upload", to: "/upload" },
  { name: "About", to: "/about" },
  { name: "Account", to: "/me" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [moreOpen, setMoreOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleLogout = async () => {
    await logout();
    dispatch(clearAuth());
    router.replace("/login");
    setMoreOpen(false);
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const updateHeight = () => {
      if (navRef.current) dispatch(setNavHeight(navRef.current.offsetHeight));
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [dispatch]);

  return (
    <>
      {/* ── Win2K Window Title Bar + Menu Bar ── */}
      <div ref={navRef} className="sticky top-0 z-50">
        {/* Title bar */}
        <div className="win-titlebar select-none">
          {/* Win2K app icon (music note) */}
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2v8.27A3 3 0 1 0 8 13V5h3V2H6z"/>
          </svg>
          <span className="text-white font-bold text-xs tracking-wide">WebMusicVault</span>
          {/* Spacer */}
          <div className="flex-1" />
          {/* Window chrome buttons */}
          <div className="flex items-center gap-0.5">
            <button className="win-raised w-[18px] h-[16px] text-[10px] font-bold text-black bg-[#d4d0c8] flex items-center justify-center leading-none" title="Minimize">_</button>
            <button className="win-raised w-[18px] h-[16px] text-[10px] font-bold text-black bg-[#d4d0c8] flex items-center justify-center leading-none" title="Maximize">□</button>
            <button className="win-raised w-[18px] h-[16px] text-[10px] font-bold text-black bg-[#d4d0c8] flex items-center justify-center leading-none" title="Close">✕</button>
          </div>
        </div>

        {/* Menu bar */}
        <div className="bg-[#d4d0c8] border-b border-[#808080] flex flex-wrap items-center gap-0 px-1 py-0.5"
             style={{ borderTop: '1px solid #ffffff' }}>
          {desktopRoutes.map((route) => {
            const isActive = pathname === route.to;
            return (
              <Link
                key={route.to}
                href={route.to}
                className={`px-3 py-0.5 text-[11px] text-black cursor-default select-none transition-none
                  ${isActive
                    ? "win-pressed bg-[#d4d0c8]"
                    : "hover:bg-[#0a246a] hover:text-white"
                  }`}
              >
                {route.name}
              </Link>
            );
          })}
          <div className="flex-1" />
          {accessToken && (
            <button
              onClick={handleLogout}
              className="px-3 py-0.5 text-[11px] text-[#cc0000] cursor-default hover:bg-[#0a246a] hover:text-white"
            >
              Log Off
            </button>
          )}
        </div>

        {/* Toolbar strip */}
        <div className="bg-[#d4d0c8] flex items-center gap-1 px-2 py-1"
             style={{ borderBottom: '2px solid #808080', borderTop: '1px solid #ffffff' }}>
          {/* Back / Forward toolbar buttons */}
          <button
            onClick={() => router.back()}
            className="win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black flex items-center gap-1 cursor-default active:win-pressed"
            title="Back"
          >
            <span className="text-[10px]">◀</span>
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => router.forward()}
            className="win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black flex items-center gap-1 cursor-default active:win-pressed"
            title="Forward"
          >
            <span className="hidden sm:inline">Forward</span>
            <span className="text-[10px]">▶</span>
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-[#808080] mx-1" />

          {/* Address bar */}
          <div className="flex items-center gap-1 flex-1">
            <span className="text-[11px] text-black hidden sm:inline">Address</span>
            <div
              className="win-sunken bg-white flex-1 px-2 py-0.5 text-[11px] text-black truncate"
              style={{ minWidth: 80 }}
            >
              C:\WebMusicVault{pathname === "/" ? "" : pathname}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile bottom nav (Win2K taskbar style) ── */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-[60]"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="win-window absolute bottom-[42px] left-0 right-0 mx-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="win-titlebar text-xs py-1 px-2">Start Menu</div>
            {mobileRoutes.map((route) => (
              <Link
                key={route.to}
                href={route.to}
                onClick={() => setMoreOpen(false)}
                className="win-listitem flex items-center gap-2 px-3 py-1.5 text-[12px] text-black border-b border-[#d4d0c8]"
              >
                <span className="text-[10px]">📁</span>
                {route.name}
              </Link>
            ))}
            {accessToken && (
              <button
                onClick={handleLogout}
                className="w-full text-left win-listitem flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#cc0000]"
              >
                <span className="text-[10px]">🔌</span>
                Log Off
              </button>
            )}
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#d4d0c8] flex items-center gap-1 px-2 py-1"
           style={{ borderTop: '2px solid #ffffff', boxShadow: 'inset 0 1px 0 #ffffff' }}>
        {/* Start button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`win-raised bg-[#d4d0c8] flex items-center gap-1 px-3 py-1 text-[12px] font-bold text-black cursor-default ${moreOpen ? "win-pressed" : ""}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="6" height="6" fill="#FF0000"/>
            <rect x="9" y="1" width="6" height="6" fill="#00CC00"/>
            <rect x="1" y="9" width="6" height="6" fill="#0000FF"/>
            <rect x="9" y="9" width="6" height="6" fill="#FFFF00"/>
          </svg>
          Start
        </button>

        {/* Quick-launch nav items */}
        <div className="w-px h-6 bg-[#808080] mx-1" />
        {[{ name: "Music", to: "/" }, { name: "Search", to: "/search" }, { name: "Playlist", to: "/playlist" }].map(({ name, to }) => (
          <Link
            key={to}
            href={to}
            className={`win-raised px-2 py-1 text-[11px] text-black cursor-default ${pathname === to ? "win-pressed" : ""}`}
          >
            {name}
          </Link>
        ))}

        <div className="flex-1" />
        {/* System clock */}
        <div className="win-sunken px-2 py-0.5 text-[11px] text-black tabular-nums">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
