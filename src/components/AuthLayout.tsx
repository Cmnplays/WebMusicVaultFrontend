"use client";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { useEffect } from "react";
import AuthPromptPage from "./screens/AuthPromptPage";
import { getUser } from "@/lib/getUser";

interface AuthLayout {
  children: React.ReactNode;
  page?: "account" | "upload";
  authorization?: boolean;
}

const AuthLayout: React.FC<AuthLayout> = ({
  children,
  page = "account",
  authorization = true,
}) => {
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!shouldFetchUser) return;

    getUser({ dispatch, username: user?.username });
  }, [shouldFetchUser, dispatch, user?.username]);

  if (!user && authorization) return <AuthPromptPage page={page} />;
  return <>{children}</>;
};

export default AuthLayout;
