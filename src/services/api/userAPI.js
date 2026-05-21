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
 *
 * Handles all known API response cases:
 *
 *  statusCode "200" + message "Valid employee"   → HOME
 *  statusCode "200" + message "Valid contractor" → STAFF_HOME (Bulk Booking only)
 *  statusCode "200" + message "Valid staff"      → STAFF_HOME (Employee + Guest Booking)
 *  statusCode "403" (employee)  → "Sorry.. This employee account is No Longer Active"
 *  statusCode "403" (staff)     → "Sorry.. This staff account is No Longer Active"
 *  statusCode "404"             → "User not found"
 *
 * Supports TWO backend patterns:
 *  (A) HTTP status 403/404  → axios throws           → handled in catch
 *  (B) HTTP always 200, error code lives in body     → checked manually after response
 */
export const validateUser = async (enrollId) => {
  if (!enrollId) throw new Error("enrollId is required");

  try {
    const response = await axiosInstance.post(
      `/employee/validateUser/${encodeURIComponent(enrollId)}`,
    );

    const { statusCode, message, result } = response.data;

    // ── Pattern B: HTTP 200 but body carries a non-success statusCode ──────
    if (statusCode !== "200") {
      const error = new Error(
        message ?? "Something went wrong. Please try again.",
      );
      error.serverMessage =
        message ?? "Something went wrong. Please try again.";
      error.statusCode = statusCode;
      throw error;
    }

    // ── Success: store JWT ─────────────────────────────────────────────────
    if (result?.token) {
      sessionStorage.setItem("cafelive_token", result.token);
    }

    // ── Attach message to result so UserContext & LoginPage can use it ─────
    // message will be one of: "Valid employee" | "Valid contractor" | "Valid staff"
    return {
      ...result,
      _message: message,
      _enrollId: String(parseInt(enrollId, 10)),
    };
  } catch (err) {
    // Already a pre-built error — re-throw as-is
    if (err.serverMessage) throw err;

    // ── Pattern A: axios threw because HTTP status was 4xx / 5xx ──────────
    const serverMessage =
      err?.response?.data?.message ?? "Face not recognised. Please try again.";

    const error = new Error(serverMessage);
    error.serverMessage = serverMessage;
    error.statusCode =
      err?.response?.data?.statusCode ?? String(err?.response?.status ?? "");
    throw error;
  }
};
