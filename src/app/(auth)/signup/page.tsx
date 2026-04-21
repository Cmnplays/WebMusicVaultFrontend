import type { Metadata } from "next";
import { AllSignupMethods } from "@/components/Forms/AllSignupMethodsForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for WebMusicVault to like songs, create playlists and upload your own music.",
};

export default function Page() {
  return <AllSignupMethods />;
}
