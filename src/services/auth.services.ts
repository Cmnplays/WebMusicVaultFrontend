import api from "../lib/api";
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

export { getUsernameSuggestions, verifyUsername };
