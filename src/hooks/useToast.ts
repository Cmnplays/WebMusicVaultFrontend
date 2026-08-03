import { toast } from "sonner";
export interface showToastProps {
  message: string;
  type?: "success" | "error" | "info";
  // duration in milliseconds
  duration?: number;
}

// Default toast duration: 1800ms
export const showToast = ({
  message,
  type = "info",
  duration = 1800,
}: showToastProps) => {
  toast[type](message, { position: "top-center", duration });
};
