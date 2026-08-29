import { requestOtp } from "@/services/auth.services";
import { ErrorCode } from "@/constants/ErrorCode";
import { StatusCode } from "@/constants/StatusCode";
import { toastList } from "./toastList";

interface reqOtpProps {
  identifier: string;
  purpose: Purpose;
}
export const reqOtp = async ({
  identifier,
  purpose,
}: reqOtpProps): Promise<boolean> => {
  try {
    await requestOtp({ identifier, purpose });
    toastList.otpSent();
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    const status = apiError.response?.status;
    const code = apiError.response?.data.code;

    switch (status) {
      case StatusCode.NotFound:
        toastList.genericError("Invalid email/username or password");
        break;
      case StatusCode.Conflict:
        if (purpose === "set-password") {
          toastList.passwordAlreadySet();
        } else if (purpose === "verify-email") {
          toastList.emailAlreadyVerified();
        }
        break;
      case StatusCode.Forbidden:
        if (code === ErrorCode.GOOGLE_ACCOUNT) {
          toastList.googleAccount();
        }
        break;
      case StatusCode.Unauthorized:
        toastList.otpVerificationFailed();
        break;
      case StatusCode.TooManyRequests:
        // Handled globally by the api response interceptor (`toastList.rateLimited`)
        // so the 429 toast is shown exactly once across the whole app.
        break;
      default:
        toastList.internalServerError();
    }
    return false;
  }
};
