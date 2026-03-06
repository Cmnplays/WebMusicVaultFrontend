"use client";
import { ForgotPasswordForm } from "@/components/Forms/ForgotPasswordForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { EmailSchemaType, emailSchema } from "@/lib/schemas/auth.schema";

const Page = () => {
  const router = useRouter();
  const form = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<EmailSchemaType> = async (data) => {
    router.push(`/password?identifier=${data.email}&purpose=edit-password`);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm
          form={form}
          onSubmit={onSubmit}
        ></ForgotPasswordForm>
      </div>
    </div>
  );
};

export default Page;
