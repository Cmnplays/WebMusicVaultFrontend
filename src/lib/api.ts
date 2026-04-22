import axios from "axios";
import store from "@/store/store";
import { clearAuth, setAccessToken } from "@/reduxSlices/auth/authSlice";
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

let isRefreshing = false;

type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    if (code === ErrorCode.TOKEN_REVOKED) {
      handleSessionExpired(code);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    if (code === ErrorCode.TOKEN_EXPIRED && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { withCredentials: true },
        );
        const newAccessToken = response.data.data; // Assuming the structure from backend controller

        store.dispatch(setAccessToken(newAccessToken));
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleSessionExpired(ErrorCode.TOKEN_EXPIRED);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (code === ErrorCode.TOKEN_REVOKED) {
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
