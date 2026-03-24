"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getUser } from "@/lib/getUser";

interface FetchUserLayoutProps {
  children: React.ReactNode;
}

const FetchUserLayout: React.FC<FetchUserLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);
    const isLoggingIn = useAppSelector(state=>state.auth.isLoggingIn)
  const searchParams = useSearchParams();
  const hasCode = !!searchParams.get("code");

  useEffect(() => {
    if (!shouldFetchUser || isLoggingIn || hasCode) return;
    getUser({ dispatch, username: user?.username });
  }, [shouldFetchUser, isLoggingIn, hasCode]);

  return <>{children}</>;
};

export default FetchUserLayout;
