// getUser.ts
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUserData,
  setShouldFetchUser,
  setIsLoggingIn,
} from "@/reduxSlices/auth/authSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import { getAccessToken } from "@/services/auth.services";
import { fetchUser } from "@/services/user.services";

interface GetUser {
  dispatch: AppDispatch;
  username?: string;
}

export const getUser = async ({ dispatch, username }: GetUser) => {
  try {
    if (username) return;
    dispatch(setLoading(true));
    const newAccessToken = await getAccessToken();
    dispatch(setAccessToken(newAccessToken));
    const user = await fetchUser();
    dispatch(setUserData(user));
  } catch (error) {
    console.error("getUser error:", error);
  } finally {
    dispatch(setShouldFetchUser(false));
    dispatch(setIsLoggingIn(false))
    dispatch(setLoading(false));
  }
};
