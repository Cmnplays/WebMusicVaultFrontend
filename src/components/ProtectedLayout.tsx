"use client";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { useEffect } from "react";
import AuthPromptPage from "./screens/AuthPromptPage";
import { getUser } from "@/lib/getUser";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);

  const isLoggingIn = useAppSelector((state) => state.auth.isLoggingIn);

  useEffect(() => {
    if (!shouldFetchUser || isLoggingIn) return;
    getUser({ dispatch, username: user?.username });
  }, [shouldFetchUser, isLoggingIn, dispatch, user?.username]);

  if (!user) return <AuthPromptPage />;
  return <>{children}</>;
};

export default ProtectedLayout;
