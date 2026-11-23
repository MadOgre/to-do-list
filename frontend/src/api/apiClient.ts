import axios from "axios";

// The shared axios instance that the API Functions in todos.ts use. The base URL is /api, from VITE_API_BASE_URL.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
