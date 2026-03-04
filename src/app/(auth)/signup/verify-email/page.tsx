"use client";
import VerifyEmailForm from "@/components/Forms/VerifyEmail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { otpSchema } from "@/lib/schemas/auth.schema";
import { verifyEmail } from "@/services/auth.services";
import { SubmitHandler } from "react-hook-form";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";

const Page = () => {
  const form = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();
  const email = useAppSelector((state) => state.auth.user?.email);
  const onSubmit: SubmitHandler<{ otp: string }> = async (data) => {
    try {
      const dataToSend = { email: email as string, otp: data.otp };
      await verifyEmail(dataToSend);
      router.push("/music");
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
  };

  return <VerifyEmailForm onSubmit={onSubmit} form={form} />;
};

export default Page;
