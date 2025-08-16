import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      gsap.to(menuRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        display: "block",
      });
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (menuRef.current) {
            menuRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isOpen]);

  // Initialize hidden menu on mount
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.height = "0";
      menuRef.current.style.opacity = "0";
      menuRef.current.style.overflow = "hidden";
      menuRef.current.style.display = "none";
    }
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/musics"
          className="flex items-center cursor-pointer select-none"
        >
          {/* Mobile: short logo */}
          <span className="flex items-center text-blue-600 sm:hidden tracking-tight">
            <span className="mr-0.5 font-semibold italic text-2xl">WmV</span>
            <svg
              className="w-8 h-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
          </span>

          {/* Desktop: full name + icon */}
          <span className="hidden sm:flex items-center space-x-2 text-blue-600 font-semibold italic text-2xl md:text-3xl tracking-tight select-none">
            <span>WebMusicVault</span>
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden sm:flex space-x-8 font-semibold text-lg">
          <li>
            <Link
              to="/musics"
              className="text-blue-600 hover:text-purple-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Music
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="text-blue-600 hover:text-purple-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
          </li>
        </ul>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 sm:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-9 h-9"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav menu */}
      <div
        ref={menuRef}
        className="sm:hidden px-6 pb-4 bg-white shadow-md overflow-hidden"
        style={{ height: 0, opacity: 0, display: "none" }}
      >
        <ul className="space-y-2">
          <li>
            <Link
              to="/musics"
              className="block text-gray-800 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Musics
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="block text-gray-800 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
