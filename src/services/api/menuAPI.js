// src\services\api\menuAPI.js

import axiosInstance from "./axiosInstance";
import mockMenu from "@mock/mockMenu";

// ─── getMenu ──────────────────────────────────────────────────────────────────

/**
 * getMenu — fetch today's full menu for all shifts.
 *
 * @returns {Promise<Object>} - Full menu with categories and items
 * @throws  {Error} - Enriched error with errorKey
 */
export const getMenu = async () => {
  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 500));
    return mockMenu;
  }

  const response = await axiosInstance.get("/menu");
  return response.data;
};

// ─── getMenuByDateShift ───────────────────────────────────────────────────────

/**
 * getMenuByDateShift — fetch menu for a specific date and shift.
 * Used when the kiosk supports advance booking or manual shift selection.
 *
 * @param  {string} date  - YYYY-MM-DD format
 * @param  {string} shift - "Morning" | "Evening" | "Night"
 * @returns {Promise<Object>} - Filtered menu object
 * @throws  {Error} - Enriched error with errorKey
 */
export const getMenuByDateShift = async (date, shift) => {
  if (!date || !shift) {
    throw new Error("date and shift are required for getMenuByDateShift");
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 500));
    return { ...mockMenu, date, shift };
  }

  const params = new URLSearchParams({ date, shift });
  const response = await axiosInstance.get(`/menu?${params.toString()}`);
  return response.data;
};
