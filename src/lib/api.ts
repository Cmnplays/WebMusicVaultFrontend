import axios from "axios";
import store from "@/store/store";
const apiBase = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "/api/v1" : apiBase,
});
api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken) {
    config.headers = config.headers ?? {};
    // ?? this ensures that if left value is either null or undefined use the right value but the || ensures that if the left value is any falsy value then use the right value. like if left value is 0 then it would use the right value.So i didn't use the || operator
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
