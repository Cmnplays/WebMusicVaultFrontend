"use client";
import { VerifyEmailForm } from "@/components/Forms/VerifyEmailForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { otpSchema } from "@/lib/schemas/auth.schema";
import { setPassword, verifyEmail } from "@/services/auth.services";
import { SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type { OtpSchemaType } from "@/lib/schemas/auth.schema";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import { StatusCode } from "@/constants/StatusCode";
import { ErrorCode } from "@/constants/ErrorCode";
import { toastList } from "@/lib/toastList";
import {
  toggleShouldAccessAuthLayer,
  toggleShouldFetchUser,
} from "@/reduxSlices/auth/authSlice";
import { reqOtp } from "@/lib/reqOtp";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose") as Purpose;
  const identifier = useAppSelector(
    (state) =>
      state.auth.user?.email ?? (searchParams.get("identifier") as string),
  );
  const form = useForm<OtpSchemaType>({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
    defaultValues: {
      otp: "",
    },
  });

  const resendOtp = async () => {
    try {
      dispatch(setLoading(true));
      await reqOtp({ identifier, purpose });
    } finally {
      dispatch(setLoading(false));
    }
  };
  const onSubmit: SubmitHandler<OtpSchemaType> = async (data) => {
    try {
      dispatch(setLoading(true));
      if (purpose === "set-password" || purpose === "edit-password") {
        const password = sessionStorage.getItem("password");
        const dataToSend = {
          identifier: identifier as string,
          password: password as string,
          otp: data.otp,
        };
        await setPassword(dataToSend);
        dispatch(toggleShouldFetchUser(true));
        router.replace("/login");
        toastList.passwordSetSuccess(purpose);
        return;
      }
      const dataToSend = { email: identifier as string, otp: data.otp };
      await verifyEmail(dataToSend);
      dispatch(toggleShouldAccessAuthLayer(false));
      toastList.accountCreated();
      router.replace("/");
    } catch (error) {
      const apiError = error as ApiError;
      const status = apiError.response?.status;
      const code = apiError.response?.data.code;

      switch (status) {
        case StatusCode.BadRequest:
          if (code === ErrorCode.VALIDATION_ERROR) {
            toastList.validationError();
          } else if (code === ErrorCode.OTP_NOT_FOUND) {
            toastList.otpNotFound();
          } else if (code === ErrorCode.OTP_EXPIRED) {
            toastList.otpExpired();
          } else {
            toastList.otpVerificationFailed();
          }
          break;
        case StatusCode.Unauthorized:
          toastList.invalidCredentials();
          break;
        case StatusCode.NotFound:
          toastList.otpVerificationFailed();
          break;
        case StatusCode.TooManyRequests:
          toastList.tooManyOtpRequests();
          break;
        default:
          toastList.internalServerError();
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editEmailHref = purpose === "set-password" ? "/login" : "/enter-email";
  return (
    <VerifyEmailForm
      onSubmit={onSubmit}
      form={form}
      purpose={purpose}
      resendOtp={resendOtp}
      editEmailHref={editEmailHref}
    />
  );
};

export default Page;
