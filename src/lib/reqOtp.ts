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
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    const status = apiError.response?.status;
    const code = apiError.response?.data.code;

    switch (status) {
      case StatusCode.NotFound:
        toastList.genericError("Account not found. Please sign up again.");
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
      case StatusCode.TooManyRequests:
        toastList.tooManyOtpRequests();
        break;
      default:
        toastList.internalServerError();
    }
    return false;
  }
};
