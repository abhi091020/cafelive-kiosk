// src\services\api\guestAPI.js

import axiosInstance from "./axiosInstance";
import mockGuests from "@mock/mockGuests";

// ─── getGuests ────────────────────────────────────────────────────────────────

/**
 * getGuests — fetch all guests registered for today.
 *
 * @returns {Promise<Array>} - List of guest objects
 * @throws  {Error} - Enriched error with errorKey
 */
export const getGuests = async () => {
  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 500));
    return mockGuests;
  }

  const response = await axiosInstance.get("/guests");
  return response.data;
};

// ─── searchGuests ─────────────────────────────────────────────────────────────

/**
 * searchGuests — search today's guest list by name.
 * In dev mode — filters mockGuests locally to simulate server-side search.
 *
 * @param  {string} name - Partial or full guest name
 * @returns {Promise<Array>} - Filtered list of matching guests
 * @throws  {Error} - Enriched error with errorKey
 */
export const searchGuests = async (name) => {
  if (!name || !name.trim()) {
    return [];
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 400));
    const query = name.trim().toLowerCase();
    return mockGuests.filter((g) => g.guestName.toLowerCase().includes(query));
  }

  const params = new URLSearchParams({ name: name.trim() });
  const response = await axiosInstance.get(
    `/guests/search?${params.toString()}`,
  );
  return response.data;
};

// ─── confirmGuest ─────────────────────────────────────────────────────────────

/**
 * confirmGuest — confirm a guest meal booking.
 *
 * @param  {Object} payload
 * @param  {string} payload.guestId   - Guest ID
 * @param  {string} payload.requestId - Request ID entered via NumPad
 * @param  {string} payload.employeeId - Host employee ID
 * @returns {Promise<Object>} - Confirmation response
 * @throws  {Error} - Enriched error with errorKey
 */
export const confirmGuest = async (payload) => {
  if (!payload?.guestId || !payload?.requestId) {
    throw new Error("guestId and requestId are required for confirmGuest");
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 700));
    return { success: true, guestId: payload.guestId, status: "CONFIRMED" };
  }

  const response = await axiosInstance.post("/guests/confirm", payload);
  return response.data;
};
