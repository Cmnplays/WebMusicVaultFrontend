"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { useEffect } from "react";
import { getUser } from "@/utils/getUser";
import { useSearchParams } from "next/navigation";

interface FetchUserLayoutProps {
  children: React.ReactNode;
}

const FetchUserLayout: React.FC<FetchUserLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const hasOAuthCode = !!searchParams.get("code");
  useEffect(() => {
    if (!shouldFetchUser || hasOAuthCode) return;
    getUser({ dispatch, username: user?.username });
  }, [shouldFetchUser, hasOAuthCode]);

  return <>{children}</>;
};

export default FetchUserLayout;
