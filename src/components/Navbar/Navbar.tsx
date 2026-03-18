"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { NavItem } from "./NavItem";
import Link from "next/link.js";
import gsap from "gsap";
import { setNavHeight } from "@/reduxSlices/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout } from "@/services/auth.services";
import { clearAuth } from "@/reduxSlices/auth/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const routesMap = [
    { name: "Music", to: "/" },
    // { name: "Shuffle", to: "/shuffle" },
    { name: "Playlist", to: "/playlist" },
    // { name: "Search", to: "/search" },
    // { name: "Upload", to: "/upload" },
    { name: "About", to: "/about" },
    { name: "Account", to: "/me" },
  ];

  const handleLogout = async () => {
    await logout();
    dispatch(clearAuth());
    router.replace("/login");
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

  useEffect(() => {
    if (!menuRef.current || typeof window === "undefined") return;
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
      className="bg-[#1a0635] border-b border-purple-500/10 shadow-[0_2px_20px_rgba(0,0,0,0.3)] sticky top-0 z-50 rounded-b-xl"
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer select-none">
          {/* Mobile Logo */}
          <span className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30">
              <svg
                className="w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
              </svg>
            </div>
            <span className="font-semibold text-xl tracking-tight text-zinc-300">
              WmV
            </span>
          </span>

          {/* Desktop Logo */}
          <span className="hidden lg:flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30">
              <svg
                className="w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
              </svg>
            </div>
            <span className="font-semibold text-xl tracking-tight text-zinc-300">
              WebMusicVault
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center space-x-2">
          {routesMap.map((link) => (
            <li key={link.to}>
              <NavItem
                href={link.to}
                label={link.name}
                variant="desktop"
                onClick={() => setIsOpen(false)}
              />
            </li>
          ))}
          {accessToken && (
            <li className="pl-2 border-l border-white/10">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex flex-col justify-center items-center space-y-1 p-1 rounded-lg border border-white/10 hover:border-purple-500/30 hover:bg-purple-950/40 transition-all"
        >
          <span
            className={`w-8 h-1 bg-purple-400 rounded transform transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`w-8 h-1 bg-purple-400 rounded transition-all ${isOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`w-8 h-1 bg-purple-400 rounded transform transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className="lg:hidden px-6 py-4 bg-[#1a0635] border-t border-purple-500/10 overflow-hidden rounded-xl mt-2 mb-3 mx-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      >
        <ul className="space-y-3">
          {routesMap.map((link) => (
            <li key={link.to}>
              <NavItem
                href={link.to}
                onClick={() => setIsOpen(false)}
                variant="mobile"
                label={link.name}
              />
            </li>
          ))}
          {accessToken && (
            <li className="border-t border-purple-500/10 pt-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
