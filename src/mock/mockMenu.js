// src\mock\mockMenu.js

// ─── Mock Menu ────────────────────────────────────────────────────────────────
// Returns a structurally valid menu for dev/testing.
// Item names are intentionally generic — real names always come from the API.
// This file validates UI shape and flow only, never canteen content.
//
// Shape mirrors the real Java backend /menu response.
// Update structure here if the backend contract changes.

// ─── Helper — generate placeholder items ──────────────────────────────────────

const makItems = (category, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${category}-${String(i + 1).padStart(3, "0")}`, // e.g. "meal-001"
    nameEn: `${category.replace("_", " ")} Item ${i + 1}`, // e.g. "meal Item 1"
    category,
    isVeg: i % 2 === 0, // alternates veg / non-veg for UI testing
  }));

// ─── Mock Menu Object ─────────────────────────────────────────────────────────

const mockMenu = {
  date: new Date().toISOString().split("T")[0], // Today: YYYY-MM-DD
  shift: "Morning",
  categories: [
    {
      id: "cat-meal",
      key: "meal",
      labelEn: "Meal",
      items: makItems("meal", 4),
    },
    {
      id: "cat-snacks",
      key: "snacks",
      labelEn: "Snacks",
      items: makItems("snacks", 3),
    },
    {
      id: "cat-tea-coffee",
      key: "tea_coffee",
      labelEn: "Tea / Coffee",
      items: makItems("tea_coffee", 2),
    },
  ],
};

export default mockMenu;
