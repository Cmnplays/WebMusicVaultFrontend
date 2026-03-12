import { toast } from "sonner";
export interface showToastProps {
  message: string;
  type: "success" | "error" | "info";
}

export const showToast = ({ message, type = "info" }: showToastProps) => {
  toast[type](message, { position: "top-center" });
};
