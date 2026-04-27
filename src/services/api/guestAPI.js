// src/services/api/guestAPI.js

import axiosInstance from "./axiosInstance";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * toArray — safely coerce a backend result to an array.
 * Handles: array, single object, null, undefined.
 * @param {*} result
 * @returns {Array}
 */
const toArray = (result) => {
  if (Array.isArray(result)) return result;
  if (result && typeof result === "object") return [result];
  return [];
};

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * getGuests — fetch all guest booking requests.
 * GET /guest/getAll
 * @returns {Promise<Array>}
 */
export const getGuests = async () => {
  const response = await axiosInstance.get("/guest/getAll");
  return toArray(response.data.result);
};

/**
 * searchGuests — filter guests by name.
 * GET /guests/search?name=...
 * @param {string} name
 * @returns {Promise<Array>}
 */
export const searchGuests = async (name) => {
  if (!name?.trim()) return [];

  const params = new URLSearchParams({ name: name.trim() });
  const response = await axiosInstance.get(
    `/guests/search?${params.toString()}`,
  );
  return toArray(response.data.result);
};

/**
 * getGuestByRequestId — fetch all bookings for a given request ID.
 * A single requestId can have multiple bookings (e.g. guest + 2 companions).
 * GET /guest/search/:requestId
 * @param {string|number} requestId
 * @returns {Promise<Array>}
 */
export const getGuestByRequestId = async (requestId) => {
  if (!requestId) throw new Error("requestId is required");

  const response = await axiosInstance.get(`/guest/search/${requestId}`);
  return toArray(response.data.result);
};

/**
 * confirmGuest — confirm a guest booking.
 * POST /guest/confirm
 * @param {{ requestId: string }} payload
 * @returns {Promise<Object>}
 */
export const confirmGuest = async (payload) => {
  if (!payload?.requestId) {
    throw new Error("requestId is required for confirmGuest");
  }

  const response = await axiosInstance.post("/booking/createGuest", {
    requestId: payload.requestId,
  });
  return response.data;
};
