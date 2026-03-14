import Link from "next/link";

const AuthNavbar = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center py-6 sm:py-8 gap-3">
      <Link href="/" className="group flex items-center gap-2.5 select-none">
        {/* icon with faint purple inner glow */}
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/30 sm:bg-purple-950/40 sm:border-white/10 sm:group-hover:border-purple-500/30 sm:group-hover:bg-purple-950/60 transition-all duration-300">
          <svg
            className="w-5 h-5 text-white sm:text-zinc-300 sm:group-hover:text-white transition-colors duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
          </svg>
        </div>

        <span className="sm:hidden font-semibold text-2xl tracking-tight text-zinc-300 group-hover:text-white transition-colors duration-300">
          WmV
        </span>
        <span className="hidden sm:inline font-semibold text-2xl tracking-tight text-zinc-300 group-hover:text-white transition-colors duration-300">
          WebMusicVault
        </span>
      </Link>

      {/* animated accent line */}
      <div className="w-16 h-px bg-gradient-to-r from-purple-500/0 via-purple-400/60 to-blue-500/0 rounded-full animate-[expand_0.6s_ease-out]" />

      {/* barely-there tagline */}
      <p className="text-xs text-zinc-700 tracking-widest uppercase">
        Hand picked. For listeners.
      </p>
    </div>
  );
};

export default AuthNavbar;
