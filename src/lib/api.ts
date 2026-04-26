import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ error?: string }>) => {
    const msg =
      error.response?.data?.error ?? error.message ?? "Request failed";
    return Promise.reject(new Error(msg));
  }
);
