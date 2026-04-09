// src/services/api/orderAPI.js

import axiosInstance from "./axiosInstance";
import { generateMockOrderResponse } from "@mock/mockOrders";

// ─── bookOrder ────────────────────────────────────────────────────────────────

/**
 * bookOrder — submit the employee's meal selection.
 *
 * Backend contract: POST /booking/bookOrder
 * Body: { empId: string, shiftId: number, items: [{ menuId: number, qty: number }] }
 *
 * @param  {Object} payload
 * @param  {string} payload.employeeId  - Employee ID
 * @param  {number} payload.shiftId     - Shift ID (from shift object)
 * @param  {Array}  payload.items       - [{ id, quantity }]
 * @returns {Promise<Object>}           - Confirmed booking result
 * @throws  {Error}                     - Enriched error with errorKey / serverMessage
 */
export const bookOrder = async (payload) => {
  if (!payload?.employeeId || !payload?.shiftId || !payload?.items?.length) {
    throw new Error("employeeId, shiftId and items are required for bookOrder");
  }

  const body = {
    empId: String(payload.employeeId),
    shiftId: Number(payload.shiftId),
    items: payload.items.map(({ id, menuId, quantity }) => ({
      itemId: Number(id),
      menuId: Number(menuId),
      qty: quantity,
    })),
  };

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 800));
    return { ...generateMockOrderResponse(), items: body.items };
  }

  const response = await axiosInstance.post("/booking/bookOrder", body);
  return response.data;
};

// ─── getOrder ─────────────────────────────────────────────────────────────────

/**
 * getOrder — retrieve a confirmed order by ID.
 *
 * @param  {string} orderId
 * @returns {Promise<Object>} - Full order object
 * @throws  {Error}           - Enriched error with errorKey
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
