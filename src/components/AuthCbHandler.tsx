"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toastList } from "@/lib/toastList";
import { exchangeOauthCode } from "@/services/auth.services";
import { useAppDispatch } from "@/store/hook";
import { setIsLoggingIn, setShouldFetchUser } from "@/reduxSlices/auth/authSlice";
const AuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch()
  useEffect(() => {
    const auth = searchParams.get("auth");
    const code = searchParams.get("code")
     async function handleGoogleLogin(code: string) {
        try {
          dispatch(setIsLoggingIn(true))
          dispatch(setShouldFetchUser(true))
          await exchangeOauthCode(code)
          toastList.loginSuccess()          
      } catch (error) {
        console.log("Error while logging in with google::", error)
        toastList.genericError()
      } finally {
        dispatch(setIsLoggingIn(false))
      }
    }
    if (code) {
      handleGoogleLogin(code)
    }
    if (auth === "error") toastList.genericError();
    // if (auth) setTimeout(() => router.replace(pathname));
    router.replace(pathname);
  }, []);

  return null;
};

export default AuthCallbackHandler;
