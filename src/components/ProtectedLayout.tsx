"use client";

import { useAppSelector } from "@/store/hook";
import React from "react";
import AuthPromptPage from "./screens/AuthPromptPage";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  skeleton,
}) => {
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);
  const user = useAppSelector((state) => state.auth.user);

  if (shouldFetchUser)
    return skeleton ? (
      skeleton
    ) : (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <i className="ri-loader-2-line text-purple-300 text-6xl animate-spin" />
      </div>
    );

  if (!user) return <AuthPromptPage />;

  return <>{children}</>;
};

export default ProtectedLayout;
