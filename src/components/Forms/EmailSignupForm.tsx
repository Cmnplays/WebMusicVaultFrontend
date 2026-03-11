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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RotateCw, CircleCheck, CircleX } from "lucide-react";
import { RegisterSchemaType } from "@/lib/schemas/auth.schema";
import Link from "next/link";

interface EmailSignupFormProps {
  form: UseFormReturn<RegisterSchemaType>;
  onSubmit: SubmitHandler<RegisterSchemaType>;
  onDisplayNameBlur: () => void;
  changeUsername: (index: number) => void;
  usernameIndex: number;
  isUsernameValid: "ok" | "notOk" | undefined;
  checkUsernameValidity: () => Promise<void>;
}

export function EmailSignupForm({
  form,
  onSubmit,
  onDisplayNameBlur,
  changeUsername,
  usernameIndex,
  isUsernameValid,
  checkUsernameValidity,
}: EmailSignupFormProps) {
  const { handleSubmit, register } = form;
  const { errors } = useFormState({ control: form.control });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="displayName">Full Name</FieldLabel>
                <Input
                  {...register("displayName")}
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  onBlur={() => onDisplayNameBlur()}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.displayName.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <div className="relative w-full">
                  <Input
                    {...register("username")}
                    id="username"
                    type="text"
                    placeholder="johndoe123"
                    className="w-full pr-10"
                    onBlur={() => checkUsernameValidity()}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5 ">
                    {/* {isChecking ? (
                    <RotateCw className="w-5 h-5 shrink-0 text-muted-foreground animate-spin" />
                  ) : isAvailable ? (
                    <CircleCheck className="w-5 h-5 shrink-0 text-green-500" />
                  ) : (
                    <CircleX className="w-5 h-5 shrink-0 text-red-500" />
                  )} */}
                    {isUsernameValid === "ok" && (
                      <CircleCheck className="w-5 h-5 shrink-0 text-green-500" />
                    )}
                    {isUsernameValid === "notOk" && (
                      <CircleX className="w-5 h-5 shrink-0 text-red-500" />
                    )}
                    <RotateCw
                      className={`w-5 h-5 shrink-0 text-muted-foreground`}
                      onClick={() => {
                        changeUsername(usernameIndex);
                      }}
                    />
                  </div>
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                <Button type="submit">Create Account</Button>
              </Field>
              <Field>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
