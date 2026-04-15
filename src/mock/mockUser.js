// src/mock/mockUser.js

// ─── Mock User ────────────────────────────────────────────────────────────────
// Fake employee object returned by /user/scan/:cardId in dev mode.
// Shape must mirror the real Java backend response exactly.
// Update field names here if the backend contract changes.

const mockUser = {
  id: "EMP-10042",
  employeeId: "MUK-10042",
  name: "Rajesh Sharma",
  department: "Production",
  shift: "Morning", // "Morning" | "Evening" | "Night"
  canBookGuest: true,
  branchId: 1, // ← added: used to filter menu by branch
  branchName: "Mumbai", // ← added: display/debug use
};

export default mockUser;
