import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hook";
import AccountSkeleton from "../AccountPage/AccountPageSkeleton";
import AuthNavbar from "../Navbar/AuthNavbar";
interface AuthPromptPageProps {
  feature?: string;
  page: "account" | "upload";
}

const AuthPromptPage = ({
  feature = "This page",
  page,
}: AuthPromptPageProps) => {
  const loading = useAppSelector((state) => state.ui.loading);
  if (loading && page === "account") return <AccountSkeleton />;
  return (
    <>
      <AuthNavbar />
      <div className="flex min-h-svh w-full items-center justify-center px-5 py-10">
        <div className="w-full max-w-md flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0">
            <LockKeyhole className="w-7 h-7 text-muted-foreground" />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
              Whoa, not so fast 👀
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground break-words">
                {feature}
              </span>{" "}
              is for members only. The good news? Joining is free and takes
              about 30 seconds — less time than finding a song you actually
              like.
            </p>
          </div>

          <div className="w-full rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground leading-relaxed text-left">
            <p>
              ✅ Already have an account? Just sign in and you&apos;re good to
              go.
            </p>
            <p className="mt-1">
              🎵 New here? Create an account — we don&apos;t bite.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button asChild className="w-full">
              <Link href="/signup">I&apos;m new — let&apos;s go</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/login">I have an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPromptPage;
