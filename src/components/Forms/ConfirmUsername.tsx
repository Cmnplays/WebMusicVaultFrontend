"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CircleCheck, CircleX, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UsernameValidity = "ok" | "notOk" | null;

const SUGGESTIONS = [
  "cosmic_dev42",
  "pixel_wizard",
  "neon_coder",
  "quiet_storm99",
  "byte_runner",
  "echo_walker",
  "drift_node",
  "spark_loop",
];

export default function ConfirmUsername() {
  const [isUsernameValid, setIsUsernameValid] =
    useState<UsernameValidity>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{ username: string }>({
    defaultValues: { username: "" },
  });

  const username = watch("username");
  const isEmpty = !username || username.trim().length === 0;

  const checkUsernameValidity = () => {
    if (!username || username.trim().length < 3) return;
    setIsUsernameValid(username === "taken_user" ? "notOk" : "ok");
  };

  const changeUsername = () => {
    const next = (suggestionIndex + 1) % SUGGESTIONS.length;
    setSuggestionIndex(next);
    setValue("username", SUGGESTIONS[next]);
    setIsUsernameValid(null);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose a Username</CardTitle>
            <CardDescription>
              This is how others will find and identify you.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {username && (
              <div className="rounded-md bg-muted px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Your profile will appear as
                </p>
                <p className="font-semibold tracking-tight">@{username}</p>
              </div>
            )}

            <form noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    {...register("username")}
                    id="username"
                    type="text"
                    placeholder="johndoe123"
                    className="w-full pr-16"
                    onBlur={checkUsernameValidity}
                    onChange={() => setIsUsernameValid(null)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
                    {isUsernameValid === "ok" && (
                      <CircleCheck className="w-5 h-5 shrink-0 text-green-500" />
                    )}
                    {isUsernameValid === "notOk" && (
                      <CircleX className="w-5 h-5 shrink-0 text-red-500" />
                    )}
                    <RotateCw
                      className="w-5 h-5 shrink-0 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      onClick={changeUsername}
                    />
                  </div>
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tap <RotateCw className="inline w-3 h-3 mb-0.5" /> to generate
                  a new suggestion.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isEmpty}
                className="w-full"
              >
                {isSubmitting ? "Saving..." : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
