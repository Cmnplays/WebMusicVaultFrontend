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

export type UpdateUserPayload = {
  displayName?: string;
  username?: string;
  avatar?: File | null;
};

const updateUser = async (
  payload: UpdateUserPayload,
): Promise<UserProfileI> => {
  const formData = new FormData();

  if (payload.displayName !== undefined) {
    formData.append("displayName", payload.displayName);
  }
  if (payload.username !== undefined) {
    formData.append("username", payload.username);
  }
  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  const response = await api.put<apiResponse<UserProfileI>>(
    "/user/update",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to update profile");
  }
  return response.data.data;
};

export { fetchUser, updateUser };