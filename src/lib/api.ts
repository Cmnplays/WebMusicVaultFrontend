import axios from "axios";
import store from "@/store/store";
import { clearAuth, setAccessToken } from "@/reduxSlices/auth.slice";
import { toastList } from "@/utils/toastList";
import { ErrorCode } from "@/constants/ErrorCode";
import { StatusCode } from "@/constants/StatusCode";
import {
  enableMaintenance,
} from "@/reduxSlices/maintenance.slice";
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
  // NOTE: the stale refresh cookie is cleared server-side by the
  // /auth/refresh-token endpoint when the refresh fails, so no extra
  // request is needed here (and /auth/logout is strict-auth anyway).
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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    // The /auth/refresh-token probe (used by getUser to detect whether a
    // visitor has a live session) must NEVER trigger interceptor side
    // effects. A guest with no refresh cookie gets a plain 401 here —
    // toasting "session expired" and hard-redirecting to /login used to
    // bounce every guest to the login page on reload. The caller (getUser)
    // handles the 401 and flips the app into guest mode instead. The
    // interceptor's internal refresh retry uses raw axios, so it is not
    // affected by this guard.
    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

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
            throw err;
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { withCredentials: true },
        );
        const newAccessToken = response.data.data;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Surface the REAL reason the refresh died: a rotated/revoked
        // refresh token (logged in on another device) gets its own
        // message; anything else is a plain expiry.
        const refreshCode =
          axios.isAxiosError(refreshError)
            ? (refreshError.response?.data?.code ?? ErrorCode.TOKEN_EXPIRED)
            : ErrorCode.TOKEN_EXPIRED;
        handleSessionExpired(refreshCode);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (code === ErrorCode.MAINTENANCE_MODE) {
      store.dispatch(
        enableMaintenance(
          error.response?.data?.message ||
            "Server is under maintenance.\n Please try again later!",
        ),
      );
    } else if (code === ErrorCode.TOKEN_REVOKED) {
      handleSessionExpired(code);
    } else if (axios.isCancel(error)) {
      // Request was cancelled (user aborted upload) - silent, no toast
    } else if (!error.response) {
      toastList.networkError();
    } else if (error.response.status === StatusCode.Unauthorized) {
      // 401 that wasn't TOKEN_EXPIRED/TOKEN_REVOKED (e.g. "Access token is required",
      // "Invalid token" when a token was sent but rejected).
      toastList.sessionExpired();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response.status === StatusCode.Forbidden) {
      toastList.genericError(
        error.response?.data?.message ||
          "You don't have permission to do that.",
      );
    } else if (error.response.status === StatusCode.NotFound) {
      toastList.genericError(
        error.response?.data?.message || "Resource not found.",
      );
    } else if (error.response.status === StatusCode.TooManyRequests) {
      // Rate-limited: show a styled in-app toast (reuses the site toast).
      // `Retry-After` is set by express-rate-limit (seconds until reset).
      const retryAfter = Number(error.response.headers?.["retry-after"]);
      toastList.rateLimited(
        Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.ceil(retryAfter)
          : undefined,
      );
    } else if (error.response.status === StatusCode.InternalServerError) {
      toastList.internalServerError();
    }
    // NOTE: For other status codes, we DON'T show a toast here.
    return Promise.reject(error);
  },
);

export default api;
