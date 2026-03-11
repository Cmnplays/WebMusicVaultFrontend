// getUser.ts
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUserData,
  toggleShouldFetchUser,
} from "@/reduxSlices/auth/authSlice";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import { fetchUser, getAccessToken } from "@/services/auth.services";

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
    dispatch(toggleShouldFetchUser(false));
    dispatch(setLoading(false));
  }
};
