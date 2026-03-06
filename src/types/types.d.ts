import { ApiError } from "next/dist/server/api-utils";
import React from "react";

declare global {
  type AudioRef = React.RefObject<HTMLAudioElement | null>;
  type PanelRef = React.RefObject<HTMLDivElement | null>;
  type InputRef = React.RefObject<HTMLInputElement | null>;
  type cursorT =
    | {
        value: string | number | Date;
        _id?: string;
      }
    | undefined;
  type sortByT = "createdAt" | "title" | "duration" | "playCount";
  type sortOrderT = "asc" | "desc";
  interface apiResponse<K> {
    status: number;
    message: string;
    data: K;
  }
  interface UserI {
    username: string;
    email: string;
    displayName: string;
    avatar: string;
    isEmailVerified?: boolean;
    role: "user" | "admin";
  }
  interface ApiError extends Error {
    response: {
      status: number;
      data: {
        code?: string;
        message?: string;
        errors?: string[];
      };
    };
  }
  type Purpose = "verify-email" | "set-password" | "edit-password";
}
