"use client";
import { VerifyEmailForm } from "@/components/Forms/VerifyEmailForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { otpSchema } from "@/lib/schemas/auth.schema";
import { setPassword, verifyEmail } from "@/services/auth.services";
import { SubmitHandler } from "react-hook-form";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type { OtpSchemaType } from "@/lib/schemas/auth.schema";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose") as Purpose;
  const identifier =
    useAppSelector((state) => state.auth.user?.email) ??
    searchParams.get("identifier");
  const form = useForm<OtpSchemaType>({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<OtpSchemaType> = async (data) => {
    try {
      if (purpose === "set-password" || purpose === "edit-password") {
        const password = sessionStorage.getItem("password");
        const dataToSend = {
          identifier: identifier as string,
          password: password as string,
          otp: data.otp,
        };
        await setPassword(dataToSend);
        return;
      }
      const dataToSend = { email: identifier as string, otp: data.otp };
      await verifyEmail(dataToSend);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    } finally {
      if (purpose === "edit-password") {
        router.push("/login");
        return;
      }
      router.push("/");
    }
  };

  return <VerifyEmailForm onSubmit={onSubmit} form={form} purpose={purpose} />;
};

export default Page;
