import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUserData,
  setShouldFetchUser,
} from "@/reduxSlices/auth.slice";
import { setLoading } from "@/reduxSlices/ui.slice";
import { getAccessToken } from "@/services/auth.services";
import { fetchUser } from "@/services/user.services";
import axios from "axios";

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
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return;
    } else {
      console.error("getUser error:", error);
    }
  } finally {
    dispatch(setShouldFetchUser(false));
    dispatch(setLoading(false));
  }
};
