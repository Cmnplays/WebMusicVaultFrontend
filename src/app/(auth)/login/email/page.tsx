"use client";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchemaType } from "@/lib/schemas/auth.schema";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginService } from "@/services/auth.services";
import { useAppDispatch } from "@/store/hook";
import { login } from "@/reduxSlices/auth/authSlice";
import { useRouter } from "next/navigation";
import { EmailLoginForm } from "@/components/Forms/EmailLoginForm";
import { setLoading } from "@/reduxSlices/ui/uiSlice";
import { toastList } from "@/lib/toastList";
import { ErrorCode } from "@/constants/ErrorCode";
import { StatusCode } from "@/constants/StatusCode";

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    try {
      dispatch(setLoading(true));
      const loginData = await loginService(data);
      dispatch(login(loginData));
      toastList.loginSuccess();
      router.push("/");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const status = apiError.response?.status;
      const code = apiError.response?.data.code;

      switch (status) {
        case StatusCode.BadRequest:
          if (code === ErrorCode.VALIDATION_ERROR) {
            toastList.validationError();
          } else {
            toastList.invalidCredentials();
          }
          break;
        case StatusCode.Unauthorized:
          toastList.invalidCredentials();
          break;
        case StatusCode.Forbidden:
          if (code === ErrorCode.GOOGLE_ACCOUNT) {
            router.push(`/password?identifier=${data.identifier}`);
            toastList.googleAccount();
          }
          break;
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <EmailLoginForm form={form} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
