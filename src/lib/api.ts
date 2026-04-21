import axios from "axios";
import store from "@/store/store";
import { clearAuth } from "@/reduxSlices/auth/authSlice";
import { toastList } from "@/utils/toastList";
import { ErrorCode } from "@/constants/ErrorCode";

const apiBase = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "/api/v1" : apiBase,
});

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken) {
    config.headers = config.headers ?? {};
    // ?? this ensures that if left value is either null or undefined use the right value but the || ensures that if the left value is any falsy value then use the right value. like if left value is 0 then it would use the right value.So i didn't use the || operator
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const handleSessionExpired = (code: string) => {
  store.dispatch(clearAuth());
  if (code === ErrorCode.TOKEN_REVOKED) {
    toastList.sessionRevoked();
  } else {
    toastList.sessionExpired();
  }

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.response.use(
  (response) => {
    const code = response.data?.code;
    if (code === ErrorCode.TOKEN_EXPIRED || code === ErrorCode.TOKEN_REVOKED) {
      handleSessionExpired(code);
    }
    return response;
  },
  (error) => {
    const code = error.response?.data?.code;
    if (code === ErrorCode.TOKEN_EXPIRED || code === ErrorCode.TOKEN_REVOKED) {
      handleSessionExpired(code);
    } else if (!error.response) {
      toastList.networkError();
    } else if (error.response.status === 500) {
      toastList.internalServerError();
    }
    return Promise.reject(error);
  },
);

export default api;
