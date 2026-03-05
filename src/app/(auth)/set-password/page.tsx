"use client";
import { SetPasswordForm } from "@/components/Forms/SetPasswordForm";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  setPasswordSchema,
  setPasswordValues,
} from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const form = useForm<setPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<setPasswordValues> = async (data) => {
    sessionStorage.setItem("password", data.password);
    router.push(
      `/verify-email?identifier=${data.identifier}&type=set-password`,
    );
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
