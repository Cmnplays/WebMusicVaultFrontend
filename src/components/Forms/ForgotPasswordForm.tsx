"use client";
import { SubmitHandler, UseFormReturn, useFormState } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { EmailSchemaType } from "@/lib/schemas/auth.schema";

interface EnterEmailFormProps {
  form: UseFormReturn<EmailSchemaType>;
  onSubmit: SubmitHandler<EmailSchemaType>;
}

export function EnterEmailForm({ form, onSubmit }: EnterEmailFormProps) {
  const { handleSubmit, register } = form;
  const { errors, isSubmitting } = useFormState({ control: form.control });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Forgot your password?</CardTitle>
            <CardDescription>
              Enter the email address linked to your account and we&apos;ll send
              you a verification code to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    autoFocus
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Reset Password
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Remembered it?{" "}
              <a
                href="/login/email"
                className="underline underline-offset-4 hover:text-primary"
              >
                Back to login
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
