import { showToast } from "@/hooks/useToast";

export const toastList = {
  // Auth
  loginSuccess: () => {
    showToast({ message: "Successfully logged in", type: "success" });
  },
  accountCreated: () =>
    showToast({ message: "Account created successfully", type: "success" }),
  passwordReset: () =>
    showToast({ message: "Password reset successfully", type: "success" }),
  googleAccount: () =>
    showToast({
      message:
        "This account uses Google login. Please sign in with Google or set your password.",
      type: "error",
    }),
  invalidCredentials: () =>
    showToast({
      message: "Invalid email/username or password",
      type: "error",
    }),

  emailExists: () =>
    showToast({ message: "This email is already registered.", type: "error" }),
  usernameExists: (username?: string) =>
    showToast({
      message: `Username ${username ?? ""} is already taken.`,
      type: "error",
    }),
  emailNotVerified: () =>
    showToast({
      message:
        "Account not verified. Please check your email for the verification code.",
      type: "error",
    }),
  passwordAlreadySet: () =>
    showToast({ message: "Password is already set.", type: "error" }),

  emailAlreadyVerified: () =>
    showToast({ message: "Email is already verified.", type: "error" }),
  validationError: () =>
    showToast({
      message: "Invalid input. Please check your data.",
      type: "error",
    }),
  genericError: (msg?: string) =>
    showToast({
      message: msg ?? "Something went wrong. Please try again.",
      type: "error",
    }),
  internalServerError: () =>
    showToast({
      message: "Internal server error. Please try later.",
      type: "error",
    }),
  // OTP / Email
  otpSent: () =>
    showToast({ message: "OTP sent successfully.", type: "success" }),
  otpNotFound: () =>
    showToast({
      message: "No OTP found. Please request a new one.",
      type: "error",
    }),
  otpExpired: () =>
    showToast({
      message: "OTP expired. Please request a new one.",
      type: "error",
    }),
  otpVerificationFailed: () =>
    showToast({ message: "Invalid OTP. Please try again.", type: "error" }),
  tooManyOtpRequests: () =>
    showToast({
      message: "Too many OTP requests. Please wait a minute and try again.",
      type: "error",
    }),
  passwordSetSuccess: (mode: Purpose) =>
    showToast({
      message: `Password ${mode === "edit-password" ? "updated" : "created"} successfully. Please log in with your new password.`,
      type: "success",
    }),
  guestMode: () =>
    showToast({
      message: "You're browsing as a guest. Some features may be limited.",
      type: "info",
    }),
};
