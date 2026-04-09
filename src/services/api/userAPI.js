// src\services\api\userAPI.js

import axiosInstance from "./axiosInstance";
import mockUser from "@mock/mockUser";

// ─── scanCard ─────────────────────────────────────────────────────────────────

/**
 * scanCard — authenticate employee via card ID or QR code value.
 *
 * @param  {string} cardId - Raw value read from card reader / QR scanner
 * @returns {Promise<Object>} - Employee user object
 * @throws  {Error} - Enriched error with errorKey (see axiosInstance)
 */
export const scanCard = async (cardId) => {
  if (!cardId || typeof cardId !== "string" || !cardId.trim()) {
    const err = new Error("scanError");
    err.errorKey = "scanError";
    throw err;
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 600)); // Simulate network delay
    return mockUser;
  }

  const response = await axiosInstance.get(
    `/user/scan/${encodeURIComponent(cardId.trim())}`,
  );
  return response.data;
};
// ADD this new function below scanCard

export const validateUser = async (empId) => {
  if (!empId) throw new Error("empId is required");

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 600));
    return mockUser;
  }

  const response = await axiosInstance.post(
    `/employee/validateUser/${encodeURIComponent(empId)}`,
  );
  return response.data.result; // ← unwrap result from { statusCode, message, result }
};
