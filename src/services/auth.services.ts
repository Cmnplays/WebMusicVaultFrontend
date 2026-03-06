import { LoginSchemaType, RegisterSchemaType } from "@/lib/schemas/auth.schema";
import api from "../lib/api";
interface AuthResponseData {
  user: UserI;
  accessToken: string;
}
type setPasswordResponse = AuthResponseData;

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
  data: RegisterSchemaType,
): Promise<AuthResponseData> => {
  const { confirmPassword, ...dataToSend } = data;
  const response = await api.post<apiResponse<AuthResponseData>>(
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

const loginService = async (
  data: LoginSchemaType,
): Promise<AuthResponseData> => {
  const response = await api.post<apiResponse<AuthResponseData>>(
    "/auth/login",
    data,
  );
  return response.data.data;
};

interface RequestOtpType {
  identifier: string;
  purpose: Purpose;
}
const requestOtp = async ({
  identifier,
  purpose,
}: RequestOtpType): Promise<void> => {
  const response = await api.post<apiResponse<boolean>>(
    `/auth/request-otp?purpose=${purpose}`,
    {
      identifier,
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
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
  return response.data.data;
};

const fetchUser = async (): Promise<UserI> => {
  const response = await api.get<apiResponse<UserI>>("/user/me");
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
  return response.data.data;
};

interface SetPasswordType {
  identifier: string;
  password: string;
  otp: string;
}
const setPassword = async (
  data: SetPasswordType,
): Promise<setPasswordResponse> => {
  const response = await api.post<apiResponse<setPasswordResponse>>(
    "/auth/set-password",
    data,
  );
  if (response.data.status !== 201) {
    throw new Error(
      response.data.message || "There was a problem while registering user",
    );
  }
  return response.data.data;
};

export {
  getUsernameSuggestions,
  verifyUsername,
  signupService,
  loginService,
  requestOtp,
  verifyEmail,
  getAccessToken,
  fetchUser,
  setPassword,
};
