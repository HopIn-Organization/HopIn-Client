import axios from "axios";
import { env } from "@/utils/env";
import { useAuthStore } from "@/store/auth.store";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  withCredentials: true,
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses — attempt token refresh once
let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry auth endpoints or already-retried requests
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/")
    ) {
      const message = error?.response?.data?.message ?? "Unexpected API error";
      return Promise.reject(new Error(message));
    }

    originalRequest._retry = true;

    try {
      // Deduplicate concurrent refresh calls
      if (!refreshPromise) {
        refreshPromise = apiClient
          .post<{ accessToken: string }>("/auth/refresh")
          .then((res) => res.data.accessToken)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      useAuthStore.getState().setAccessToken(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch {
      // Refresh failed — force logout
      useAuthStore.getState().signOut();
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired"));
    }
  },
);
