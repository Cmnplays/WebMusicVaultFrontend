"use client";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { useEffect } from "react";
import AuthPromptPage from "./screens/AuthPromptPage";
import { getUser } from "@/lib/getUser";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  page: "account" | "upload" | "playlist" | "playlist/songs";
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  page,
}) => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    getUser({ dispatch, username: user?.username });
  }, [shouldFetchUser, dispatch, user?.username]);

  if (!user) return <AuthPromptPage page={page} />;
  return <>{children}</>;
};

export default ProtectedLayout;
