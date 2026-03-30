// src\mock\mockOrders.js

// ─── Mock Orders ──────────────────────────────────────────────────────────────
// Fake order confirmation returned by POST /order/book in dev mode.
// Token number is randomised on each call to simulate real behaviour.
// Shape mirrors the real Java backend response exactly.

/**
 * generateMockOrderResponse — call this in orderAPI.js for each booking.
 * Returns a fresh object with a random token number every time.
 * @returns {Object}
 */
export const generateMockOrderResponse = () => ({
  orderId: `ORD-${Date.now()}`,
  tokenNumber: String(Math.floor(100 + Math.random() * 900)), // e.g. "347"
  employeeId: "MUK-10042",
  shift: "Morning",
  bookedAt: new Date().toISOString(),
  status: "CONFIRMED",
});

export default generateMockOrderResponse;
