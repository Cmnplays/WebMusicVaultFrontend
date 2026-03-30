"use client";
import { EnterEmailForm } from "@/components/Forms/ForgotPasswordForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailSchemaType, emailSchema } from "@/lib/schemas/auth.schema";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purpose = searchParams?.get("purpose") as Purpose;
  const form = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<EmailSchemaType> = async (data) => {
    router.push(`/password?identifier=${data.email}&purpose=${purpose}`);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <EnterEmailForm form={form} onSubmit={onSubmit}></EnterEmailForm>
      </div>
    </div>
  );
};

export default Page;
