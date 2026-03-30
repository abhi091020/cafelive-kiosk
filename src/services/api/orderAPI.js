// src\services\api\orderAPI.js

import axiosInstance from "./axiosInstance";
import { generateMockOrderResponse } from "@mock/mockOrders";

// ─── bookOrder ────────────────────────────────────────────────────────────────

/**
 * bookOrder — submit the employee's meal selection.
 * Returns a confirmed order containing the token number for ticket printing.
 *
 * @param  {Object}   payload
 * @param  {string}   payload.employeeId  - Employee ID
 * @param  {string}   payload.shift       - Current shift
 * @param  {Array}    payload.items       - [{ id, quantity }]
 * @param  {string}   [payload.date]      - YYYY-MM-DD (defaults to today)
 * @returns {Promise<Object>}             - Confirmed order with tokenNumber
 * @throws  {Error}                       - Enriched error with errorKey
 */
export const bookOrder = async (payload) => {
  if (!payload?.employeeId || !payload?.items?.length) {
    throw new Error("employeeId and items are required for bookOrder");
  }

  const body = {
    employeeId: payload.employeeId,
    shift: payload.shift,
    date: payload.date ?? new Date().toISOString().split("T")[0],
    items: payload.items.map(({ id, quantity }) => ({ id, quantity })),
  };

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 800));
    return { ...generateMockOrderResponse(), items: body.items };
  }

  const response = await axiosInstance.post("/order/book", body);
  return response.data;
};

// ─── getOrder ─────────────────────────────────────────────────────────────────

/**
 * getOrder — retrieve a confirmed order by ID.
 * Used on OrderSuccessScreen to display booking summary.
 *
 * @param  {string} orderId
 * @returns {Promise<Object>} - Full order object
 * @throws  {Error} - Enriched error with errorKey
 */
export const getOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("orderId is required for getOrder");
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 400));
    return generateMockOrderResponse();
  }

  const response = await axiosInstance.get(
    `/order/${encodeURIComponent(orderId)}`,
  );
  return response.data;
};
