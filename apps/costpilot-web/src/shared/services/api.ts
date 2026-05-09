import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://costpilot-api.omshuklalko3.workers.dev",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});
