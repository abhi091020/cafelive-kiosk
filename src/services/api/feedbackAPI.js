import axiosInstance from "./axiosInstance";

// ─── getFoodFeedbackQuestions ─────────────────────────────────────────────────
/**
 * GET /feedback/getAllFoodAllocationList
 * Returns food feedback questions (Taste, Freshness, Portion Size, Appearance).
 */
export const getFoodFeedbackQuestions = async () => {
  const response = await axiosInstance.get(
    "/feedback/getAllFoodAllocationList",
  );
  return response.data; // { statusCode, message, result: Question[] }
};

// ─── getOverallFeedbackQuestions ──────────────────────────────────────────────
/**
 * GET /feedback/getAllOverallAllocationList
 * Returns overall feedback questions (Canteen Cleanliness, Staff Behaviour etc.).
 */
export const getOverallFeedbackQuestions = async () => {
  const response = await axiosInstance.get(
    "/feedback/getAllOverallAllocationList",
  );
  return response.data; // { statusCode, message, result: Question[] }
};

// ─── getConsumedFoodForFeedback ───────────────────────────────────────────────
/**
 * GET /feedback/getEmpWiseConsumedFoodForFeedback/{empId}
 * Returns meals consumed by the employee eligible for feedback.
 * 403 = no meals found — returns empty result, NOT treated as an error.
 */
export const getConsumedFoodForFeedback = async (empId) => {
  try {
    const response = await axiosInstance.get(
      `/feedback/getEmpWiseConsumedFoodForFeedback/${empId}`,
    );
    return response.data; // { statusCode: "200", message, result: Meal[] }
  } catch (error) {
    // 403 = "Food Feedback not found" — treat as empty, not a crash
    if (
      error?.response?.status === 403 ||
      error?.response?.data?.statusCode === "403"
    ) {
      return {
        statusCode: "403",
        message: "Food Feedback not found...!",
        result: [],
      };
    }
    throw error;
  }
};

// ─── saveFoodFeedback ─────────────────────────────────────────────────────────
/**
 * POST /feedback/SaveFeedBack
 * Saves star ratings for ALL food feedback questions in one call.
 *
 * @param {Array<{ star: number, empId: number, menuId: number, questionId: number, bookingId: number }>} feedbackResponseList
 */
export const saveFoodFeedback = async (feedbackResponseList) => {
  const response = await axiosInstance.post("/feedback/SaveFeedBack", {
    feedbackResponseList,
  });
  return response.data; // { statusCode, message, result }
};

// ─── saveOverallFeedback ──────────────────────────────────────────────────────
/**
 * POST /feedback/saveOverallFeedBack
 * Saves star ratings for ALL overall feedback questions in one call.
 *
 * @param {Array<{ star: number, empId: number, questionId: number, bookingId: number }>} feedbackResponseList
 */
export const saveOverallFeedback = async (feedbackResponseList) => {
  const response = await axiosInstance.post("/feedback/saveOverallFeedBack", {
    feedbackResponseList,
  });
  return response.data; // { statusCode, message, result }
};
