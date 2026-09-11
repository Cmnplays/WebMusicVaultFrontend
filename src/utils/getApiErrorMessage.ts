type ApiErrorLike = {
  response?: {
    status?: number;
    data?: { message?: string };
  };
};

// Status codes the axios response interceptor (src/lib/api.ts) already
// surfaces with its own toast (network / 401 / 403 / 404 / 429 / 500).
// When one of these occurs, the interceptor's toast uses the backend's
// message, so components must NOT show a second (often generic) toast.
const INTERCEPTOR_TOASTED_STATUSES = new Set([401, 403, 404, 429, 500]);

/**
 * Extracts the most useful error message from a thrown error.
 *
 * Priority:
 * 1. `null` when the interceptor already toasted this error (see set above).
 * 2. Backend-provided message (`err.response.data.message`) — the
 *    intentional, human-readable text the API sends (e.g. "Audio file is
 *    too large. Maximum allowed size is 25 MB").
 * 3. `err.message` — client-side Error or axios's generic text.
 * 4. The provided fallback.
 */
const getApiErrorMessage = (
  err: unknown,
  fallback = "Something went wrong",
): string | null => {
  if (err instanceof Error) {
    const apiError = err as ApiErrorLike;
    if (
      apiError.response?.status &&
      INTERCEPTOR_TOASTED_STATUSES.has(apiError.response.status)
    ) {
      return null;
    }
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    return err.message || fallback;
  }
  return fallback;
};

export default getApiErrorMessage;
