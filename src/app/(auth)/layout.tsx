"use client";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const loading = useAppSelector((state) => state.ui.loading);
  const shouldAccessAuthLayer = useAppSelector(
    (state) => state.auth.shouldAccessAuthLayer,
  );
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  useEffect(() => {
    if (accessToken && !shouldAccessAuthLayer) {
      router.replace("/");
      return;
    }
  }, []);

  return (
    <div className="bg-zinc-950">
      {children}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
        </div>
      )}
    </div>
  );
}
