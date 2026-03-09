import { Button } from "@/components/ui/button";
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
import { UseFormReturn, SubmitHandler, useFormState } from "react-hook-form";
import { LoginSchemaType } from "@/lib/schemas/auth.schema";

interface EmailLoginFormProps {
  form: UseFormReturn<LoginSchemaType>;
  onSubmit: SubmitHandler<LoginSchemaType>;
}

export function EmailLoginForm({ form, onSubmit }: EmailLoginFormProps) {
  const { handleSubmit, register } = form;
  const { errors } = useFormState({ control: form.control });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...register("identifier")}
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  required
                />
                {errors.identifier && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.identifier.message}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account? <a href="/signup">Register</a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
