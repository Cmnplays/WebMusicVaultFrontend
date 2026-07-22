"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toastList } from "@/utils/toastList";
import { exchangeOauthCode } from "@/services/auth.services";
import { useAppDispatch } from "@/store/hook";
import { setShouldFetchUser } from "@/reduxSlices/auth.slice";
import { getAccessToken } from "@/services/auth.services";
import { setAccessToken } from "@/reduxSlices/auth.slice";
import { setUserData } from "@/reduxSlices/auth.slice";
import { fetchUser } from "@/services/user.services";
import { setLoading } from "@/reduxSlices/ui.slice";

const AuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = searchParams?.get("auth") as string;
    const code = searchParams?.get("code") as string;
    if (!auth || !code) return;

    async function handleGoogleLogin(code: string) {
      try {
        dispatch(setLoading(true));
        dispatch(setShouldFetchUser(true));
        await exchangeOauthCode(code);
        const newAccessToken = await getAccessToken();
        dispatch(setAccessToken(newAccessToken));
        const user = await fetchUser();
        dispatch(setUserData(user));
        toastList.loginSuccess();
      } catch (error) {
        console.log("Error while logging in with google::", error);
        toastList.genericError();
      } finally {
        dispatch(setShouldFetchUser(false));
        window.history.replaceState({}, "", pathname);
        // router.replace(pathname);
      }
    }

    if (code) {
      handleGoogleLogin(code);
      return;
    }

    if (auth === "error") toastList.genericError();
    router.replace(pathname as string);
  }, []);
  return null;
};

export default AuthCallbackHandler;
