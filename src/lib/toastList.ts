import { showToast } from "@/hooks/useToast";
export const toastList = {
  loginSuccess: () =>
    showToast({ message: "Successfully logged in", type: "success" }),
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
      message: "Login failed. Please check your credentials.",
      type: "error",
    }),
  emailExists: () =>
    showToast({ message: "This email is already registered.", type: "error" }),
  genericError: (msg?: string) =>
    showToast({
      message: msg ?? "Something went wrong. Please try again.",
      type: "error",
    }),
  validationError: (msg?: string) =>
    showToast({
      message: msg ?? "Validation failed. Please check your input.",
      type: "error",
    }),
};
