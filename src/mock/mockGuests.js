// src/mock/mockGuests.js

// ─── Mock Guests ──────────────────────────────────────────────────────────────
// 6 entries to match the 6-row table in the SVG design.
// Shape mirrors the real Java backend response exactly.

const mockGuests = [
  {
    guestId: "GUE-001",
    requestId: "REQ-4421",
    guestName: "Arjun Mehta",
    company: "TechnoWave Pvt Ltd",
    visitDate: "25 Mar 2025",
    status: "PENDING",
    host: {
      employeeId: "MUK-10042",
      name: "Rajesh Sharma",
      department: "Production",
    },
  },
  {
    guestId: "GUE-002",
    requestId: "REQ-4422",
    guestName: "Priya Nair",
    company: "Global Ventures",
    visitDate: "25 Mar 2025",
    status: "PENDING",
    host: {
      employeeId: "MUK-10058",
      name: "Anil Deshmukh",
      department: "Quality Control",
    },
  },
  {
    guestId: "GUE-003",
    requestId: "REQ-4423",
    guestName: "Sameer Khan",
    company: "Nexus Industries",
    visitDate: "25 Mar 2025",
    status: "CONFIRMED", // Already booked — tests disabled/booked UI state
    host: {
      employeeId: "MUK-10031",
      name: "Meera Joshi",
      department: "HR",
    },
  },
  {
    guestId: "GUE-004",
    requestId: "REQ-4424",
    guestName: "Kavita Reddy",
    company: "Horizon Corp",
    visitDate: "25 Mar 2025",
    status: "PENDING",
    host: {
      employeeId: "MUK-10075",
      name: "Suresh Patil",
      department: "Finance",
    },
  },
  {
    guestId: "GUE-005",
    requestId: "REQ-4425",
    guestName: "Ravi Gupta",
    company: "AlphaNet Solutions",
    visitDate: "25 Mar 2025",
    status: "PENDING",
    host: {
      employeeId: "MUK-10089",
      name: "Deepa Kulkarni",
      department: "Operations",
    },
  },
  {
    guestId: "GUE-006",
    requestId: "REQ-4426",
    guestName: "Sneha Pillai",
    company: "Zenith Enterprises",
    visitDate: "25 Mar 2025",
    status: "PENDING",
    host: {
      employeeId: "MUK-10094",
      name: "Vikram Singh",
      department: "IT",
    },
  },
];

export default mockGuests;
