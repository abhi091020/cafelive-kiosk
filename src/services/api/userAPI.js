import axiosInstance from "./axiosInstance";

/**
 * scanCard — authenticate employee via card ID or QR code value.
 * GET /user/scan/:cardId
 */
export const scanCard = async (cardId) => {
  if (!cardId || typeof cardId !== "string" || !cardId.trim()) {
    const err = new Error("scanError");
    err.errorKey = "scanError";
    throw err;
  }

  const response = await axiosInstance.get(
    `/user/scan/${encodeURIComponent(cardId.trim())}`,
  );
  return response.data;
};

/**
 * validateUser — validate employee by enroll ID.
 * POST /employee/validateUser/:enrollId
 */
export const validateUser = async (enrollId) => {
  if (!enrollId) throw new Error("enrollId is required");

  const response = await axiosInstance.post(
    `/employee/validateUser/${encodeURIComponent(enrollId)}`,
  );
  return response.data.result;
};
