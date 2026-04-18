export type DataSourceMode = "mock" | "api";

console.log(import.meta.env.VITE_DATA_SOURCE);

export const env = {
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? "mock") as DataSourceMode,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/",
};
