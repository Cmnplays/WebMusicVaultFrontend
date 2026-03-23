"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toastList } from "@/lib/toastList";

import { useAppDispatch } from "@/store/hook";
import { toggleShouldFetchUser } from "@/reduxSlices/auth/authSlice";
import { exchangeOauthCode } from "@/services/auth.services";

const AuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = searchParams.get("auth");
    const code = searchParams.get("code");

    const handleOAuthCodeExchange = async (code: string) => {
      try {
        await exchangeOauthCode(code);
        toastList.loginSuccess();
        dispatch(toggleShouldFetchUser(true));
      } catch (error) {
        console.error("OAuth exchange error:", error);
        toastList.genericError();
      }
    };

    if (auth === "success") {
      if (code) {
        handleOAuthCodeExchange(code);
      } else {
        toastList.loginSuccess();
        dispatch(toggleShouldFetchUser(true));
      }
    }

    if (auth === "error") toastList.genericError();
    if (auth) router.replace(pathname);
  }, [searchParams, pathname, router, dispatch]);

  return null;
};

export default AuthCallbackHandler;
