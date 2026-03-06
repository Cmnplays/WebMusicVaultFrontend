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
interface SetPasswordFormProps {
  form: UseFormReturn<SetPasswordSchemaType>;
  onSubmit: SubmitHandler<SetPasswordSchemaType>;
}

export function SetPasswordForm({ form, onSubmit }: SetPasswordFormProps) {
  const { handleSubmit, register } = form;
  const { errors } = useFormState({ control: form.control });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <CardTitle>Add a password to your account</CardTitle>
        <CardDescription>
          Looks like you signed in with Google before. You can set a password
          now so you can also log in with your email next time — totally
          optional, but handy.
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

            <FieldGroup>
              <FieldSeparator>Or continue with</FieldSeparator>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <span className="w-5 h-5 flex items-center">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        d="M8.15991 6.54543V9.64362H12.4654C12.2763 10.64 11.709 11.4837 10.8581 12.0509L13.4544 14.0655C14.9671 12.6692 15.8399 10.6182 15.8399 8.18188C15.8399 7.61461 15.789 7.06911 15.6944 6.54552L8.15991 6.54543Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M3.6764 9.52268L3.09083 9.97093L1.01807 11.5855C2.33443 14.1963 5.03241 16 8.15966 16C10.3196 16 12.1305 15.2873 13.4542 14.0655L10.8578 12.0509C10.1451 12.5309 9.23598 12.8219 8.15966 12.8219C6.07967 12.8219 4.31245 11.4182 3.67967 9.5273L3.6764 9.52268Z"
                        fill="#34A853"
                      />
                      <path
                        d="M8.15982 3.18545C9.33802 3.18545 10.3853 3.59271 11.2216 4.37818L13.5125 2.0873C12.1234 0.792777 10.3199 0 8.15982 0C5.03257 0 2.33443 1.79636 1.01807 4.41455L3.67985 6.48001C4.31254 4.58908 6.07983 3.18545 8.15982 3.18545Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M1.01803 4.41455C0.472607 5.49087 0.159912 6.70543 0.159912 7.99995C0.159912 9.29447 0.472607 10.509 1.01803 11.5854C1.01803 11.5926 3.6799 9.51991 3.6799 9.51991C3.5199 9.03991 3.42532 8.53085 3.42532 7.99987C3.42532 7.46889 3.5199 6.95983 3.6799 6.47983L1.01803 4.41455Z"
                        fill="#FBBC05"
                      />
                    </svg>
                  </span>
                  <a href="http://localhost:3001/api/v1/auth/google">
                    Continue with Google
                  </a>
                </Button>
                <FieldDescription className="text-center">
                  Just want to browse?{" "}
                  <a href="/music" className="underline underline-offset-4">
                    Skip for now
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
