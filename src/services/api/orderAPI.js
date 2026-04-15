import axiosInstance from "./axiosInstance";

// ─── helper ──────────────────────────────────────────────────────────────────
/**
 * Throws a typed error when the backend returns HTTP 200 but statusCode !== "200".
 * e.g. { statusCode: "500", message: "Food limit exceed!", result: null }
 */
const assertSuccess = (data) => {
  if (data?.statusCode !== "200") {
    const err = new Error(data?.message ?? "Request failed");
    err.serverMessage =
      data?.message ?? "Something went wrong. Please try again.";
    throw err;
  }
};

// ─── bookOrder ────────────────────────────────────────────────────────────────
/**
 * bookOrder — book a single employee meal order.
 * POST /booking/bookOrder
 */
export const bookOrder = async (payload) => {
  if (!payload?.employeeId || !payload?.shiftId || !payload?.items?.length) {
    throw new Error("employeeId, shiftId and items are required for bookOrder");
  }

  const body = {
    bookingType: "EMPLOYEE",
    empId: Number(payload.employeeId),
    shiftId: Number(payload.shiftId),
    deviceId: Number(payload.deviceId ?? 1),
    staffId: payload.staffId ?? null,
    items: payload.items.map(({ menuId, quantity }) => ({
      menuId: Number(menuId),
      qty: Number(quantity),
    })),
  };

  const response = await axiosInstance.post("/booking/bookOrder", body);

  // ✅ Catches: "Food limit exceed!", "Already booked", etc.
  assertSuccess(response.data);

  return response.data;
};

// ─── bookBulkOrder ────────────────────────────────────────────────────────────
/**
 * bookBulkOrder — book a bulk meal order for multiple employees.
 * POST /booking/bulkOrder
 */
export const bookBulkOrder = async (payload) => {
  if (!payload?.empId || !payload?.shiftId || !payload?.items?.length) {
    throw new Error("empId, shiftId and items are required for bookBulkOrder");
  }

  const body = {
    bookingType: "EMPLOYEE",
    empId: Number(payload.empId),
    shiftId: Number(payload.shiftId),
    deviceId: Number(payload.deviceId ?? 1),
    items: payload.items.map(({ menuId, quantity }) => ({
      menuId: Number(menuId), // ✅ caller (bulk-booking page) now sends menuId: i.id
      quantity: Number(quantity),
    })),
  };

  const response = await axiosInstance.post("/booking/bulkOrder", body);

  // ✅ Same guard for bulk orders
  assertSuccess(response.data);

  return response.data;
};

// ─── getOrder ─────────────────────────────────────────────────────────────────
/**
 * getOrder — fetch a single order by ID.
 * GET /order/:orderId
 */
export const getOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required for getOrder");

  const response = await axiosInstance.get(
    `/order/${encodeURIComponent(orderId)}`,
  );
  return response.data;
};
