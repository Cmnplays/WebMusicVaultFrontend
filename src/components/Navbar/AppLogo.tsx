import Link from "next/link";

const AppLogo = () => (
  <Link href="/" className="flex items-center gap-1.5 select-none">
    <div className="w-6 h-6 flex items-center justify-center"
         style={{ imageRendering: 'pixelated' }}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="2" y="2" width="5" height="5" fill="#ff6600"/>
        <rect x="9" y="2" width="5" height="5" fill="#0000ff"/>
        <rect x="2" y="9" width="5" height="5" fill="#00aa00"/>
        <rect x="9" y="9" width="5" height="5" fill="#ffcc00"/>
      </svg>
    </div>
    <span className="text-white font-bold text-xs">WebMusicVault</span>
  </Link>
);

export default AppLogo;
