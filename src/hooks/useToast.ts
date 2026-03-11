"use client";

import { toast } from "sonner"; // or "@shadcn/ui" toast
export interface showToastProps {
  message: string;
  type: "success" | "error" | "info";
}

export const showToast = ({ message, type = "info" }: showToastProps) => {
  toast[type](message);
};
