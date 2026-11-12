import axios from "axios";

// The shared axios instance the API Functions use once a real API exists (see the REAL API blocks in todos.ts).
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
