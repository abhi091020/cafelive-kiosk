// src/services/api/menuAPI.js

import axios from "axios";
import axiosInstance from "./axiosInstance";

// ─── Dedicated client for menu server (192.168.10.120:8000) ──────────────────
const menuClient = axios.create({
  baseURL: import.meta.env.VITE_MENU_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach same auth token as main client
menuClient.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("cafelive_token") ||
    import.meta.env.VITE_CAFELIVE_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Date helper ──────────────────────────────────────────────────────────────
const getTodayDate = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ─── getShifts ────────────────────────────────────────────────────────────────
export const getShifts = async () => {
  const response = await axiosInstance.get("/shift/getAllShiftData");
  return response.data.result;
};

// ─── getDayWiseFoodAllocation ─────────────────────────────────────────────────
export const getDayWiseFoodAllocation = async (shiftId) => {
  const allocationDate = getTodayDate();
  try {
    const response = await menuClient.get(
      `/food-allocation/getDayWiseFoodAllocationByDate/${allocationDate}/${shiftId}`,
    );
    return response.data.result ?? { mealTypes: [] };
  } catch (err) {
    if (err.response?.status === 404) {
      return { mealTypes: [] };
    }
    throw err;
  }
};
