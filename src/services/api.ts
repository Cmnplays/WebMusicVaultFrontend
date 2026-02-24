import axios from "axios";
const apiBase = process.env.NEXT_PUBLIC_API_URL;
import store from "@/store/store";
const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  //   const accessToken = store.getState().auth.accessToken;
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTY4YzhhZTY1ZGM5Y2NlZWVmNDM3NWEiLCJpYXQiOjE3NzE5NTY1MzUsImV4cCI6MTc3MjA0MjkzNX0.bhjMGjE7-arlLzWhZM230Pq7VmfWkjhYZGnX-_jWXiw";
  if (accessToken) {
    // config.headers = config.headers || {};
    config.headers = config.headers ?? {};
    //Note:
    // ?? this ensures that if left value is either null or undefined use the right value but the || ensures that if the left value is any falsy value then use the right value. like if left value is 0 then it would use the right value.So i didn't use the || operator
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
