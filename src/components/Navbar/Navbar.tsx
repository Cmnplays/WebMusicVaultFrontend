"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { NavItem } from "./NavItem";
import Link from "next/link.js";
import gsap from "gsap";
import { setNavHeight } from "@/reduxSlices/ui/uiSlice";
import { useAppDispatch } from "@/store/hook";
import { logout } from "@/services/auth.services";
import { clearAuth } from "@/reduxSlices/auth/authSlice";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const routesMap = [
    { name: "Music", to: "/" },
    { name: "Shuffle", to: "/shuffle" },
    { name: "Playlist", to: "/playlist" },
    { name: "Search", to: "/search" },
    { name: "Upload", to: "/upload" },
    { name: "About", to: "/about" },
    { name: "Account", to: "/me" },
  ];
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
      className="bg-white border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sticky top-0 z-50 rounded-b-xl"
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer select-none">
          {/* Mobile Logo */}
          <span className="flex items-center text-blue-600 lg:hidden tracking-tight">
            <span className="mr-1 font-bold italic text-3xl bg-linear-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
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
            <span className="bg-linear-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
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
        <ul className="hidden lg:flex space-x-4 font-semibold text-lg">
          {routesMap.map((link) => (
            <li key={link.to}>
              <NavItem
                href={link.to}
                label={link.name}
                variant="desktop"
                onClick={() => setIsOpen(false)}
              ></NavItem>
            </li>
          ))}
          <li>
            <button
              onClick={async () => {
                await logout();
                dispatch(clearAuth());
                router.replace("/login");
              }}
              className="font-semibold text-lg text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 lg:hidden flex flex-col justify-center items-center space-y-1 p-1 rounded hover:bg-gray-50 shadow-sm transition-all"
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
        className="lg:hidden px-6 py-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden rounded-xl mt-2 mb-3 mx-2"
      >
        <ul className="space-y-3">
          {routesMap.map((link) => (
            <li key={link.to}>
              <NavItem
                href={link.to}
                onClick={() => setIsOpen(false)}
                variant="mobile"
                label={link.name}
              ></NavItem>
            </li>
          ))}
          <li className="border-t border-gray-100 pt-2">
            <button
              onClick={async () => {
                await logout();
                dispatch(clearAuth());
                router.replace("/login");
              }}
              className="w-full text-left font-semibold text-lg text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
