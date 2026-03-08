"use client";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  if (accessToken) {
    router.replace("/");
    return;
  }
  return <div className="bg-zinc-950">{children}</div>;
}
