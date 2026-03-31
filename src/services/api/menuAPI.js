// src/services/api/menuAPI.js

import axiosInstance from "./axiosInstance";

// ─── Day name helper ──────────────────────────────────────────────────────────
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getTodayName = () => DAY_NAMES[new Date().getDay()];

// ─── Mock data (inline — no longer imports mockMenu) ─────────────────────────
const MOCK_MENU = [
  {
    menuId:                1,
    menuEnglishName:       "Biryani",
    menuHindiName:         "बिरयानी",
    menuMarathiName:       "बिर्याणी",
    imagePath:             "",
    typeOfMeal:            "Veg",
    status:                true,
    branchId:              1,
    branchName:            "Mumbai",
    mealTypeIds:           "1",
    mealTypeEnglishNames:  "Lunch",
    mealTypeHindiNames:    "दोपहर का खाना",
    mealTypeMarathiNames:  "दुपारचे जेवण",
    weekDay:               "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    createdOn:             new Date().toISOString().split("T")[0],
  },
  {
    menuId:                2,
    menuEnglishName:       "Samosa",
    menuHindiName:         "समोसा",
    menuMarathiName:       "समोसा",
    imagePath:             "",
    typeOfMeal:            "Veg",
    status:                true,
    branchId:              1,
    branchName:            "Mumbai",
    mealTypeIds:           "2",
    mealTypeEnglishNames:  "Snacks",
    mealTypeHindiNames:    "नाश्ता",
    mealTypeMarathiNames:  "नाश्ता",
    weekDay:               "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    createdOn:             new Date().toISOString().split("T")[0],
  },
  {
    menuId:                3,
    menuEnglishName:       "Masala Chai",
    menuHindiName:         "मसाला चाय",
    menuMarathiName:       "मसाला चहा",
    imagePath:             "",
    typeOfMeal:            "Veg",
    status:                true,
    branchId:              1,
    branchName:            "Mumbai",
    mealTypeIds:           "3",
    mealTypeEnglishNames:  "Tea/Coffee",
    mealTypeHindiNames:    "चाय/कॉफी",
    mealTypeMarathiNames:  "चहा/कॉफी",
    weekDay:               "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    createdOn:             new Date().toISOString().split("T")[0],
  },
];

// ─── getShifts ────────────────────────────────────────────────────────────────

/**
 * getShifts — fetch all available shifts from backend.
 *
 * @returns {Promise<Array>} - Array of { shiftId, shiftName, startTime, endTime }
 */
export const getShifts = async () => {
  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 300));
    return [
      { shiftId: 1, shiftName: "1st Shift",     startTime: "06:00", endTime: "14:00" },
      { shiftId: 2, shiftName: "2nd Shift",     startTime: "14:00", endTime: "22:00" },
      { shiftId: 3, shiftName: "3rd Shift",     startTime: "22:00", endTime: "06:00" },
      { shiftId: 4, shiftName: "General Shift", startTime: "09:00", endTime: "18:00" },
    ];
  }

  const response = await axiosInstance.get("/shift/getAllShiftData");
  return response.data.result;
};

// ─── getMenu ──────────────────────────────────────────────────────────────────

/**
 * getMenu — fetch today's menu filtered by branchId.
 *
 * @param  {number|null} branchId - From user session (UserContext)
 * @returns {Promise<Array>} - Raw array of menu items from API
 */
export const getMenu = async (branchId = null) => {
  if (import.meta.env.VITE_DEV_MODE === "true") {
    await new Promise((r) => setTimeout(r, 500));

    const today = getTodayName();

    // Filter mock by branchId + today's weekDay
    return MOCK_MENU.filter((item) => {
      const branchMatch = branchId ? item.branchId === branchId : true;
      const dayMatch    = item.weekDay?.split(",").map((d) => d.trim()).includes(today);
      return branchMatch && dayMatch;
    });
  }

  // ── Real API ──────────────────────────────────────────────────────────────
  const params = new URLSearchParams();
  if (branchId) params.set("branchId", branchId);

  const response = await axiosInstance.get(
    `/menu/getAllMenu${params.toString() ? `?${params}` : ""}`
  );
  return response.data.result;
};