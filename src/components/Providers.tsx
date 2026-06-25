"use client";
import { StoreProvider } from "@/store/StoreProvider";
import AppContent from "./AppContent";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppContent>{children}</AppContent>
    </StoreProvider>
  );
}
