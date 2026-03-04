import { SignupFormValues } from "@/lib/schemas/auth.schema";
import api from "../lib/api";
interface SignupResponseData {
  user: UserI;
  accessToken: string;
}
const getUsernameSuggestions = async (
  identifier: string,
  noOfSuggestions: number,
): Promise<string[]> => {
  const response = await api.post<apiResponse<string[]>>(
    "/auth/username-suggestions",
    {
      identifier,
      n: noOfSuggestions,
    },
  );
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
  return response.data.data;
};

const verifyUsername = async (username: string): Promise<boolean> => {
  const response = await api.post<apiResponse<boolean>>(
    "/auth/verify-username",
    {
      username,
    },
  );
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
  return response.data.data;
};

const signupService = async (
  data: SignupFormValues,
): Promise<SignupResponseData> => {
  const { confirmPassword, ...dataToSend } = data;
  const response = await api.post<apiResponse<SignupResponseData>>(
    "/auth/signup",
    dataToSend,
  );
  if (response.data.status !== 201) {
    throw new Error(
      response.data.message || "There was a problem while registering user",
    );
  }
  return response.data.data;
};

const requestOtp = async (email: string): Promise<void> => {
  const response = await api.post<apiResponse<boolean>>(
    "/auth/request-otp?purpose=verify-email",
    {
      email,
    },
  );
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
};

const verifyEmail = async (data: {
  email: string;
  otp: string;
}): Promise<void> => {
  console.log(data);
  const response = await api.post<apiResponse<boolean>>(
    "/auth/verify-email",
    data,
  );
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
};

const getAccessToken = async (): Promise<string> => {
  const response = await api.get<apiResponse<string>>("/auth/refresh-token", {
    withCredentials: true,
  });
  return response.data.data;
};

const getUserDetails = async (): Promise<void> => {
  const response = await api.get<apiResponse<string>>("/user/", {});
  console.log(response.data.data);
};

export {
  getUsernameSuggestions,
  verifyUsername,
  signupService,
  requestOtp,
  verifyEmail,
  getAccessToken,
  getUserDetails,
};
