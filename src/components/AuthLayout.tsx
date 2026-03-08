"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import React from "react";
import AuthPromptPage from "./screens/AuthPromptPage";
import { useEffect } from "react";
import { getUser } from "@/lib/getUser";
interface AuthLayout {
  children: React.ReactNode;
  page: "account" | "upload";
}
const AuthLayout: React.FC<AuthLayout> = ({ children, page }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  useEffect(() => {
    getUser({ dispatch, accessToken });
  }, [accessToken]);

  if (!accessToken) return <AuthPromptPage page={page} />;
  return <>{children}</>;
};

export default AuthLayout;
