import axios from "axios";
import { env } from "@/utils/env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message ?? "Unexpected API error";
    return Promise.reject(new Error(message));
  },
);
