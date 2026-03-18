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
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VerifyEmailProps {
  form: UseFormReturn<{ otp: string }>;
  onSubmit: SubmitHandler<{ otp: string }>;
  purpose: Purpose;
  resendOtp: () => Promise<void>;
  editEmailHref: string;
}

export function VerifyEmailForm({
  form,
  onSubmit,
  purpose,
  resendOtp,
  editEmailHref,
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
            {purpose === "verify-email" && (
              <Button variant="ghost" asChild className="w-fit -ml-2 mb-2">
                <Link href="/signup">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
              </Button>
            )}
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              {purpose === "edit-password" &&
                "You are updating your password. Enter the 6-digit code we sent to your email to confirm the change."}
              {purpose === "set-password" &&
                "Create a password for your account by entering the 6-digit code sent to your email."}
              {purpose === "verify-email" &&
                "Enter the 6-digit code we sent to your email address to verify your email."}
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

            <div>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  onClick={() => resendOtp()}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Resend
                </button>
              </p>
              {purpose !== "verify-email" && (
                <p className="text-sm text-muted-foreground">
                  Wrong email?{" "}
                  <Link
                    href={editEmailHref}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Edit email
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
