// src\services\api\axiosInstance.js

import axios from "axios";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_TIMEOUT_MS = 10_000; // 10 seconds — per documentation spec
const AUTH_TOKEN_KEY = "cafelive_token"; // sessionStorage key for JWT

// ─── Create Instance ──────────────────────────────────────────────────────────

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
    // Attach auth token if present (Phase 5 — Java backend auth)
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
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
    const url = error.config?.url ?? "unknown";

    // ── Map HTTP status → i18n error key ─────────────────────────────────
    // Error keys match keys in errors{} section of en.json.
    // Screens use these keys with t(`errors.${errorKey}`) to show messages.

    let errorKey = "unknownError";

    if (!error.response) {
      // No response — network down or request timed out
      errorKey = error.code === "ECONNABORTED" ? "apiTimeout" : "networkError";
    } else {
      switch (status) {
        case 401:
          errorKey = "sessionExpired";
          break;
        case 409:
          errorKey = "alreadyBooked";
          break; // Meal already booked for shift
        case 503:
          errorKey = "networkError";
          break;
        default:
          errorKey = "unknownError";
          break;
      }
    }

    // Attach structured info to the error for consuming API functions
    const enriched = new Error(errorKey);
    enriched.errorKey = errorKey;
    enriched.status = status ?? null;
    enriched.url = url;
    enriched.original = error;

    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.error(`[API ✕] ${status ?? "NO_RESPONSE"} ${url} →`, errorKey);
    }

    return Promise.reject(enriched);
  },
);

export default axiosInstance;
