"use client";
import { useAppSelector } from "@/store/hook";
import AuthLayout from "@/components/AuthLayout";
import Navbar from "@/components/Navbar/Navbar";
import AccountCard from "@/components/AccountPage/AccountPage";

export default function AccountPage() {
  const user = useAppSelector((s) => s.auth.user) as UserI | null;

  return (
    <>
      <Navbar />
      <AuthLayout page="account">
        <AccountCard
        // data={{ ...(user as UserI), uploadedSongs: 1, favouriteSongs: 1 }}
        />
      </AuthLayout>
    </>
  );
}
