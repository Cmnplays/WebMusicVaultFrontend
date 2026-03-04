import { z } from "zod";
const username = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(30, "Username must be less than or equal to 30 characters")
  .regex(
    /^[A-Za-z0-9._]+$/,
    "Username can only contain lowercase letters, numbers, dots, and underscores",
  )
  .transform((u) => u.toLowerCase());

const email = z
  .string()
  .email("Invalid email format")
  .trim()
  .transform((e) => e.toLowerCase());

const displayName = z
  .string()
  .trim()
  .min(2, "Display name must be at least 2 characters")
  .max(30, "Display name must be less than or equal to 30 letters");

const password = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(50, "Password must be less than or equal to 50 characters");

const identifier = email.or(username);
const otp = z.coerce
  .string()
  .trim()
  .length(6, "Otp must be combination of 6 numbers");

const otpSchema = z.object({ otp });
const registerSchema = z
  .object({
    displayName,
    email,
    username,
    password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  identifier,
  password,
});

export type SignupFormValues = z.infer<typeof registerSchema>;
export { registerSchema, loginSchema, otpSchema };
