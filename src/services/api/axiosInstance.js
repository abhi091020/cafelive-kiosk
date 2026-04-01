// src/services/api/axiosInstance.js

import axios from "axios";

const API_TIMEOUT_MS = 10_000;
const AUTH_TOKEN_KEY = "cafelive_token";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      import.meta.env.VITE_CAFELIVE_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log(
        `[API ▶] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        config.data ?? "",
      );
    }

    return config;
  },
  (error) => {
    console.error("[API] Request setup error:", error);
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log(
        `[API ◀] ${response.status} ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url ?? "unknown";

    let errorKey = "unknownError";

    if (!error.response) {
      errorKey = error.code === "ECONNABORTED" ? "apiTimeout" : "networkError";
    } else {
      switch (status) {
        case 401: errorKey = "sessionExpired"; break;
        case 409: errorKey = "alreadyBooked";  break;
        case 500: errorKey = "serverError";    break;
        case 503: errorKey = "networkError";   break;
        default:  errorKey = "unknownError";   break;
      }
    }

    const enriched = new Error(errorKey);
    enriched.errorKey      = errorKey;
    enriched.status        = status ?? null;
    enriched.url           = url;
    enriched.original      = error;
    // ✅ ADDED: attach backend message so UI can show it directly
    enriched.serverMessage = error.response?.data?.message ?? null;

    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.error(`[API ✕] ${status ?? "NO_RESPONSE"} ${url} →`, errorKey);
    }

    return Promise.reject(enriched);
  },
);

export default axiosInstance;