import type { Metadata } from "next";
import { AllLoginMethodsForm } from "@/components/Forms/AllLoginMethodsForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to WebMusicVault to access your playlists, liked songs and upload history.",
};

export default function Page() {
  return <AllLoginMethodsForm />;
}
