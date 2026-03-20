import Link from "next/link";

const AppLogo = () => (
  <Link href="/" className="group flex items-center gap-2.5 select-none">
    <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/30 group-hover:border-purple-500/60 group-hover:bg-purple-950/80 transition-all duration-300">
      <svg
        className="w-5 h-5 text-white group-hover:text-white transition-colors duration-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
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
);

export default AppLogo;
