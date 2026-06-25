import { useAppSelector } from "@/store/hook";
import ScrollToTop from "@/components/ScrollToTop";
import FetchUserLayout from "@/components/FetchUserLayout";
import { Toaster } from "@/components/ui/sonner";
import AuthCallbackHandler from "@/components/AuthCbHandler";
import { Suspense } from "react";
import MaintenancePrompt from "./screens/MaintenancePrompt";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUnderMaintenance = useAppSelector(
    (state) => state.maintenance.isUnderMaintenance,
  );

  if (isUnderMaintenance) {
    return <MaintenancePrompt />;
  }
  return (
    <>
      <ScrollToTop />
      <FetchUserLayout>{children}</FetchUserLayout>
      <Toaster />
      <Suspense>
        <AuthCallbackHandler />
      </Suspense>
    </>
  );
}
