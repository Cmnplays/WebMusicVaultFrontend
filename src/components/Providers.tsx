"use client";
import { StoreProvider } from "@/store/StoreProvider";
import ScrollToTop from "@/components/ScrollToTop";
import FetchUserLayout from "@/components/FetchUserLayout";
import { Toaster } from "@/components/ui/sonner";
import AuthCallbackHandler from "@/components/AuthCbHandler";
import { Suspense } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ScrollToTop />
      <FetchUserLayout>{children}</FetchUserLayout>
      <Toaster />
      <Suspense>
        <AuthCallbackHandler />
      </Suspense>
    </StoreProvider>
  );
}
