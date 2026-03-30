// src\services\api\feedbackAPI.js

import axiosInstance from "./axiosInstance";

// ─── submitFoodFeedback ───────────────────────────────────────────────────────

/**
 * submitFoodFeedback — submit ratings for today's meal quality.
 *
 * @param  {Object} payload
 * @param  {string} payload.employeeId  - Employee ID
 * @param  {string} payload.shift       - Current shift
 * @param  {number} payload.taste       - Rating 1–4
 * @param  {number} payload.freshness   - Rating 1–4
 * @param  {number} payload.portionSize - Rating 1–4
 * @param  {number} payload.appearance  - Rating 1–4
 * @returns {Promise<Object>} - Submission confirmation
 * @throws  {Error} - Enriched error with errorKey
 */
export const submitFoodFeedback = async (payload) => {
  if (!payload?.employeeId) {
    throw new Error("employeeId is required for submitFoodFeedback");
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, type: "food" };
  }

  const response = await axiosInstance.post("/feedback/food", payload);
  return response.data;
};

// ─── submitOverallFeedback ────────────────────────────────────────────────────

/**
 * submitOverallFeedback — submit ratings for overall canteen experience.
 *
 * @param  {Object} payload
 * @param  {string} payload.employeeId         - Employee ID
 * @param  {number} payload.canteenCleanliness - Rating 1–4
 * @param  {number} payload.staffBehaviours    - Rating 1–4
 * @param  {number} payload.speedOfService     - Rating 1–4
 * @param  {number} payload.qualityOfFacilities - Rating 1–4
 * @returns {Promise<Object>} - Submission confirmation
 * @throws  {Error} - Enriched error with errorKey
 */
export const submitOverallFeedback = async (payload) => {
  if (!payload?.employeeId) {
    throw new Error("employeeId is required for submitOverallFeedback");
  }

  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, type: "overall" };
  }

  const response = await axiosInstance.post("/feedback/overall", payload);
  return response.data;
};
