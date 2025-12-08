import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import gsap from "gsap";
import { setNavHeight } from "../reduxSlices/song/songSlice.ts";
import { useAppDispatch } from "../store/hook.ts";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (navRef.current) dispatch(setNavHeight(navRef.current.offsetHeight));
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [dispatch]);

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
          if (menuRef.current) menuRef.current.style.display = "none";
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.height = "0";
      menuRef.current.style.opacity = "0";
      menuRef.current.style.overflow = "hidden";
      menuRef.current.style.display = "none";
    }
  }, []);

  return (
    <nav
      className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50"
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/musics"
          className="flex items-center cursor-pointer select-none"
        >
          {/* Mobile Logo */}
          <span className="flex items-center text-blue-600 lg:hidden tracking-tight">
            <span className="mr-1 font-bold italic text-3xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              WmV
            </span>
            <svg
              className="w-8 h-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
          </span>

          {/* Desktop Logo */}
          <span className="hidden lg:flex items-center space-x-2 font-bold italic text-3xl tracking-tight select-none">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              WebMusicVault
            </span>
            <svg
              className="w-7 h-7 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex space-x-6 font-semibold text-lg">
          {[
            { name: "Music", to: "/musics" },
            { name: "Upload", to: "/upload" },
            { name: "Search", to: "/search-songs" },
            { name: "Shuffle", to: "/random-player" },
            { name: "About", to: "/about" },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-1 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white transform transition-all hover:scale-105"
                    : "px-3 py-1 rounded-lg text-blue-600 hover:text-purple-700 hover:scale-105 transform transition-all"
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 md:hidden flex flex-col justify-center items-center space-y-1 p-1 rounded hover:bg-gray-100 shadow-sm transition-all"
          aria-label="Toggle menu"
        >
          <span
            className={`w-8 h-1 bg-purple-600 rounded transform transition-all ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-8 h-1 bg-purple-600 rounded transition-all ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`w-8 h-1 bg-purple-600 rounded transform transition-all ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className="md:hidden px-6 py-4 bg-white shadow-lg overflow-hidden rounded-xl mt-2 mb-3 mx-2 border border-gray-100"
        style={{ height: 0, opacity: 0, display: "none" }}
      >
        <ul className="space-y-3">
          {[
            { name: "Music", to: "/musics" },
            { name: "Upload", to: "/upload" },
            { name: "Search", to: "/search-songs" },
            { name: "Shuffle", to: "/random-player" },
            { name: "About", to: "/about" },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block font-semibold px-4 py-2 rounded-lg transition-all shadow-sm ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                      : "text-purple-700 hover:bg-purple-50 hover:translate-x-1 transform"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
