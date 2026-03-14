"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
  href: string;
  label: string;
  onClick?: () => void;
  variant?: "desktop" | "mobile"; // optional: desktop or mobile styles
};

export function NavItem({
  href,
  label,
  onClick,
  variant = "desktop",
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const classesByVariant = {
    desktop: isActive
      ? "px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-purple-600/40 border border-purple-400/30 transition-all"
      : "px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200",
    mobile: isActive
      ? "block px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600/40 border border-purple-400/30 transition-all"
      : "block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all",
  };

  return (
    <Link href={href} className={classesByVariant[variant]} onClick={onClick}>
      {label}
    </Link>
  );
}
