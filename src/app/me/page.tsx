"use client";
import { useAppSelector } from "@/store/hook";
import ProtectedLayout from "@/components/ProtectedLayout";
import Navbar from "@/components/Navbar/Navbar";
import AccountCard from "@/components/AccountPage/AccountPage";

export default function AccountPage() {
  const user = useAppSelector((s) => s.auth.user) as UserI | null;

  return (
    <>
      <ProtectedLayout page="account">
        <Navbar />
        <AccountCard
        // data={{ ...(user as UserI), uploadedSongs: 1, favouriteSongs: 1 }}
        />
      </ProtectedLayout>
    </>
  );
}
