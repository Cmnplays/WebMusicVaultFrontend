"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toastList } from "@/lib/toastList";

const AuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth === "success") toastList.loginSuccess();
    if (auth === "error") toastList.genericError();
    // if (auth) setTimeout(() => router.replace(pathname));
    router.replace(pathname);
  }, []);

  return null;
};

export default AuthCallbackHandler;
