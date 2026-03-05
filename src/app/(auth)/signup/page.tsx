"use client";
import { useState } from "react";
import { SignupForm } from "@/components/Forms/SignupForm";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  getUsernameSuggestions,
  signupService,
  verifyUsername,
} from "@/services/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { SignupFormValues } from "@/lib/schemas/auth.schema";
import { signup } from "@/reduxSlices/auth/authSlice";
import { useAppDispatch } from "@/store/hook";
import { useRouter } from "next/navigation";
import { requestOtp } from "@/services/auth.services";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    const { accessToken, user } = await signupService(data);
    dispatch(signup({ user, accessToken }));
    try {
      await requestOtp(user.email);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
    router.push("/verify-email?type=signup");
  };

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [usernameIndex, setUsernameIndex] = useState(1);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [isUsernameValid, setIsUsernameValid] = useState<"ok" | "notOk">();

  const fetchUsernameSuggestions = async () => {
    const isDisplayNameValid = await form.trigger("displayName");
    if (!isDisplayNameValid) return;
    const displayName = form.getValues("displayName");
    const suggestions = await getUsernameSuggestions(displayName, 5);
    setUsernameSuggestions(suggestions);
    form.setValue("username", suggestions[0], {
      shouldValidate: false,
      shouldTouch: false,
      shouldDirty: false,
    });
    setIsUsernameValid("ok");
  };

  const checkUsernameValidity = async () => {
    let isValid = await form.trigger("username");
    if (!isValid) return;
    const username = form.getValues("username");
    //here the case can come when the user enters a username which was sent by the backend but some other person used that in the meanwhile, i can like reverify that username also but i am gonna skip those for now.I am only going to verify username touched by the user.
    if (usernameSuggestions.includes(username)) {
      setIsUsernameValid("ok");
    }
    isValid = await verifyUsername(username);
    setIsUsernameValid(isValid ? "ok" : "notOk");
  };

  const changeUsername = (n: number) => {
    setUsernameIndex(usernameIndex + 1);
    if (n === usernameSuggestions.length) {
      setUsernameIndex(0);
    }
    form.setValue("username", usernameSuggestions[n]);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm
          form={form}
          onSubmit={onSubmit}
          onDisplayNameBlur={fetchUsernameSuggestions}
          changeUsername={changeUsername}
          usernameIndex={usernameIndex}
          isUsernameValid={isUsernameValid}
          checkUsernameValidity={checkUsernameValidity}
        />
      </div>
    </div>
  );
}
