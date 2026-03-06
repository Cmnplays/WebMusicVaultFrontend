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
import { requestOtp } from "@/services/auth.services";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SetPasswordSchemaType> = async (data) => {
    sessionStorage.setItem("password", data.password);
    const identifier = searchParams.get("identifier");
    const purpose = searchParams.get("purpose");
    await requestOtp({
      identifier: identifier as string,
      purpose: purpose as Purpose,
    });
    router.push(`/verify-email?identifier=${identifier}&purpose=${purpose}`);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SetPasswordForm form={form} onSubmit={onSubmit}></SetPasswordForm>
      </div>
    </div>
  );
};

export default Page;
