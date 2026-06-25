"use client";
import { SetPasswordForm } from "@/components/Forms/SetPasswordForm";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  setPasswordSchema,
  SetPasswordSchemaType,
} from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toastList } from "@/utils/toastList";
import { reqOtp } from "@/utils/reqOtp";
import { useAppDispatch } from "@/store/hook";
import { setLoading } from "@/reduxSlices/ui.slice";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const form = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const purpose = searchParams?.get("purpose") as Purpose;

  const onSubmit: SubmitHandler<SetPasswordSchemaType> = async (data) => {
    try {
      dispatch(setLoading(true));
      sessionStorage.setItem("password", data.password);
      const identifier = searchParams?.get("identifier");
      const res = await reqOtp({ identifier: identifier as string, purpose });
      if (res) {
        router.push(
          `/verify-email?identifier=${identifier}&purpose=${purpose}`,
        );
        toastList.otpSent();
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SetPasswordForm form={form} onSubmit={onSubmit} purpose={purpose} />
      </div>
    </div>
  );
};

export default Page;
