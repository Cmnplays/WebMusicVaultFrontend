import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import ScrollToTop from "@/components/ScrollToTop";
import FetchUserLayout from "@/components/FetchUserLayout";
import { Toaster } from "@/components/ui/sonner";
import AuthCallbackHandler from "@/components/AuthCbHandler";

export const metadata: Metadata = {
  title: "WebMusicVault",
  description: "Developer - Aaditya",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`relative overflow-x-hidden`}>
        <div className="fixed inset-0 -z-10" />
        <StoreProvider>
          <ScrollToTop />
          <FetchUserLayout>{children}</FetchUserLayout>
          <Toaster />
          <AuthCallbackHandler />
        </StoreProvider>
      </body>
    </html>
  );
}
