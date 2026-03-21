import api from "../lib/api";

const fetchUser = async (): Promise<UserProfileI> => {
  const response = await api.get<apiResponse<UserProfileI>>("/user/me");
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message || "There was a problem while fetching user data",
    );
  }
  return response.data.data;
};

export { fetchUser };