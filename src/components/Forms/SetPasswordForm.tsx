import { Button } from "@/components/ui/button";
import { UseFormReturn, SubmitHandler, useFormState } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import { SetPasswordSchemaType } from "@/lib/schemas/auth.schema";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
interface SetPasswordFormProps {
  form: UseFormReturn<SetPasswordSchemaType>;
  onSubmit: SubmitHandler<SetPasswordSchemaType>;
  purpose: Purpose;
}

export function SetPasswordForm({
  form,
  onSubmit,
  purpose,
}: SetPasswordFormProps) {
  const { handleSubmit, register } = form;
  const { errors } = useFormState({ control: form.control });
  const backHref = `/enter-email?purpose=${purpose}`;
  return (
    <Card>
      <CardHeader>
        <Button variant="ghost" asChild className="w-fit -ml-2 mb-2">
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
        </Button>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <CardTitle>
          {purpose === "set-password"
            ? "Add a password to your account"
            : "Reset your password"}
        </CardTitle>
        <CardDescription>
          {purpose === "set-password"
            ? "Looks like you signed in with Google before. You can set a password now so you can also log in with your email next time — totally optional, but handy."
            : "Enter your new password below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                />
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Set Password
                </Button>
              </Field>
            </FieldGroup>

            {purpose === "set-password" ? (
              <FieldGroup>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <span className="w-5 h-5 flex items-center">
                      {/* same svg */}
                    </span>
                    <a href="http://localhost:3001/api/v1/auth/google">
                      Google
                    </a>
                  </Button>
                  <FieldDescription className="text-center">
                    Just browsing?{" "}
                    <Link href="/" className="underline underline-offset-4">
                      Continue as guest
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            ) : (
              <FieldDescription className="text-center">
                Wrong email?{" "}
                <Link href={backHref} className="underline underline-offset-4">
                  Edit email
                </Link>
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
