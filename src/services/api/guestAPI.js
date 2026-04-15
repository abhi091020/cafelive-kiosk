import axiosInstance from "./axiosInstance";

/**
 * getGuests — fetch all guest booking requests.
 * GET /guest/getAll
 */
export const getGuests = async () => {
  const response = await axiosInstance.get("/guest/getAll");
  return response.data.result;
};

/**
 * searchGuests — filter guests by name.
 * GET /guests/search?name=...
 */
export const searchGuests = async (name) => {
  if (!name || !name.trim()) return [];

  const params = new URLSearchParams({ name: name.trim() });
  const response = await axiosInstance.get(
    `/guests/search?${params.toString()}`,
  );
  return response.data.result;
};

/**
 * getGuestByRequestId — fetch a single guest by request ID.
 * GET /guest/search/:requestId
 */
export const getGuestByRequestId = async (requestId) => {
  if (!requestId) throw new Error("requestId is required");

  const response = await axiosInstance.get(`/guest/search/${requestId}`);
  return response.data.result;
};

/**
 * confirmGuest — confirm a guest booking.
 * POST /guest/confirm
 */
export const confirmGuest = async (payload) => {
  if (!payload?.requestId) {
    throw new Error("requestId is required for confirmGuest");
  }

  const response = await axiosInstance.post("/guest/confirm", {
    requestId: payload.requestId,
  });
  return response.data;
};
