import { setLoading } from "@/reduxSlices/song/songSlice";
import { fetchUser, getAccessToken } from "@/services/auth.services";
import { setAccessToken, setUserData } from "@/reduxSlices/auth/authSlice";
import { AppDispatch } from "@/store/store";
interface GetUser {
  dispatch: AppDispatch;
  accessToken: string | null;
}
export const getUser = async ({ dispatch, accessToken }: GetUser) => {
  try {
    if (accessToken) return;
    dispatch(setLoading(true));
    const newAccessToken = await getAccessToken();
    dispatch(setAccessToken(newAccessToken));
    const user = await fetchUser();
    dispatch(setUserData(user));
  } catch (error) {
    dispatch(setLoading(false));
  }
};
