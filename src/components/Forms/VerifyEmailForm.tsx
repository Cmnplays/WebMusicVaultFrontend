"use client";
import {
  useFormState,
  useWatch, // 👈 swap watch for this
  SubmitHandler,
  UseFormReturn,
  Controller,
} from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp"; // 👈 not from @/components/ui/input-otp
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type OtpPage = "signup" | "set-password" | "edit-password";
interface VerifyEmailProps {
  form: UseFormReturn<{ otp: string }>;
  onSubmit: SubmitHandler<{ otp: string }>;
  type: OtpPage;
  requestOtp?: () => void;
}

export default function VerifyEmail({
  form,
  onSubmit,
  type,
  requestOtp,
}: VerifyEmailProps) {
  const { handleSubmit, control } = form;
  const { errors, isSubmitting } = useFormState({ control });

  const otp = useWatch({ control, name: "otp" });
  const isIncomplete = (otp?.length ?? 0) < 6;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              {type === "edit-password" &&
                "You are updating your password. Enter the 6-digit code we sent to your email to confirm the change."}
              {type === "set-password" &&
                "Create a password for your account by entering the 6-digit code sent to your email."}
              {type === "signup" &&
                "Enter the 6-digit code we sent to your email address."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col items-center gap-4 w-full"
            >
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />

              {errors.otp && (
                <p className="text-sm text-red-500 self-start">
                  {errors.otp.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || isIncomplete}
                className="w-full"
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={() => requestOtp?.()}
                className="underline underline-offset-4 hover:text-primary"
              >
                Resend
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
