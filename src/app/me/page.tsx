"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import ProtectedLayout from "@/components/ProtectedLayout";
import Navbar from "@/components/Navbar/Navbar";
import AccountCard from "@/components/AccountPage/AccountPage";
import AccountSkeleton from "@/components/AccountPage/AccountPageSkeleton";

export default function AccountPage() {
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    document.title = "My Account | WmV";
  }, []);

  return (
    <>
      <ProtectedLayout skeleton={<AccountSkeleton />}>
        <Navbar />
        <AccountCard data={user!} />
      </ProtectedLayout>
    </>
  );
}
