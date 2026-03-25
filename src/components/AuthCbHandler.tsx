"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toastList } from "@/lib/toastList";
import { exchangeOauthCode } from "@/services/auth.services";
import { useAppDispatch } from "@/store/hook";
import { setShouldFetchUser } from "@/reduxSlices/auth/authSlice";
import { getAccessToken } from "@/services/auth.services";
import { setAccessToken } from "@/reduxSlices/auth/authSlice";
import { setUserData } from "@/reduxSlices/auth/authSlice";
import { fetchUser } from "@/services/user.services";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import { useAppSelector } from "@/store/hook";

const AuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const shouldFetchUser = useAppSelector((state) => state.auth.shouldFetchUser);

  useEffect(() => {
    const auth = searchParams.get("auth");
    const code = searchParams.get("code");

    async function handleGoogleLogin(code: string) {
      try {
        dispatch(setLoading(true));
        dispatch(setShouldFetchUser(true));
        console.log("setted should  fetch user to true", shouldFetchUser);
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
      console.log("Yes there is code");
      handleGoogleLogin(code);
      return;
    }

    if (auth === "error") toastList.genericError();
    router.replace(pathname);
  }, []);
  return null;
};

export default AuthCallbackHandler;
