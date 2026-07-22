"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AppLogo = () => {
  const pathname = usePathname();
  const isSearchActive = pathname === "/search";

  return (
    <>
      <Link
        href="/"
        aria-label="WebMusicVault Home"
        className="group flex items-center gap-2.5 select-none"
      >
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/30 group-hover:border-purple-500/60 group-hover:bg-purple-950/80 transition-all duration-300">
          <svg
            className="w-5 h-5 text-white group-hover:text-white transition-colors duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
          </svg>
        </div>
        <span className="lg:hidden font-semibold text-2xl tracking-tight text-white group-hover:text-white transition-colors duration-300">
          WmV
        </span>
        <span className="hidden lg:inline font-semibold text-2xl tracking-tight text-zinc-300 group-hover:text-white transition-colors duration-300">
          WebMusicVault
        </span>
      </Link>

      <Link
        href="/search"
        aria-label="Search"
        className={`lg:hidden flex items-center justify-center p-1 rounded-lg transition-colors ${
          isSearchActive
            ? "text-white bg-purple-600/40 border border-purple-400/30"
            : "text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent"
        }`}
      >
        <Search className="w-6 h-6" />
      </Link>
    </>
  );
};

export default AppLogo;
