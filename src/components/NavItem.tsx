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
      ? "px-3 py-1 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white transform transition-all hover:scale-105"
      : "px-3 py-1 rounded-lg text-blue-600 hover:text-purple-700 hover:scale-105 transform transition-all duration-200",
    mobile: isActive
      ? "block font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md transition-all"
      : "block font-semibold px-4 py-2 rounded-lg text-purple-700 hover:bg-purple-50 hover:translate-x-1 transform transition-all",
  };

  return (
    <Link href={href} className={classesByVariant[variant]} onClick={onClick}>
      {label}
    </Link>
  );
}
