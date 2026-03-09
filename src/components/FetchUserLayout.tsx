"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { useEffect } from "react";
import { getUser } from "@/lib/getUser";

interface FetchUserLayoutProps {
  children: React.ReactNode;
}

const FetchUserLayout: React.FC<FetchUserLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!shouldFetchUser) return;

    getUser({ dispatch, username: user?.username });
  }, [shouldFetchUser, dispatch, user?.username]);

  return <>{children}</>;
};

export default FetchUserLayout;
