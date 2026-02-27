import axios from "axios";
const apiBase = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  //   const accessToken = store.getState().auth.accessToken;
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTllZDZjNTRhMzZlZTlmOTJlYmM1YWYiLCJpYXQiOjE3NzIyMTUwNzIsImV4cCI6MTc3MjMwMTQ3Mn0.Wusix_4Es_Act5ckscjmGAcn-okDMyhys3t0qkItHFQ";
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
