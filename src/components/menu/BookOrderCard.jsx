// src/components/menu/BookOrderCard.jsx

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getShifts, getDayWiseFoodAllocation } from "@services/api/menuAPI";

import MealIcon from "@assets/meal/meal.png";
import SnacksIcon from "@assets/meal/snacks.png";
import TeaIcon from "@assets/meal/teacoffee.png";

const ROW_HEIGHT = "clamp(140px, 19vh, 210px)";
const SIDEBAR_HEIGHT = "clamp(140px, 19vh, 210px)";
const IMG_SIZE = "clamp(85px, 11.5vh, 135px)";

// ─── Static meal type config (keyed by mealTypeId from API) ──────────────────
// mealTypeId 1 = Lunch/Meal, 2 = Snacks, 3 = Tea/Coffee
// Extend this map if the backend adds more meal types.
const MEAL_TYPE_CONFIG = {
  1: {
    key: "meal",
    labelEn: "Lunch",
    labelHi: "दोपहर का खाना",
    labelMr: "दुपारचे जेवण",
    icon: MealIcon,
  },
  2: {
    key: "snacks",
    labelEn: "Snacks",
    labelHi: "नाश्ता",
    labelMr: "नाश्ता",
    icon: SnacksIcon,
  },
  3: {
    key: "tea_coffee",
    labelEn: "Tea/Coffee",
    labelHi: "चाय/कॉफी",
    labelMr: "चहा/कॉफी",
    icon: TeaIcon,
  },
};

const DEFAULT_CONFIG = (mealTypeId) => ({
  key: `meal_type_${mealTypeId}`,
  labelEn: `Meal Type ${mealTypeId}`,
  labelHi: `भोजन प्रकार ${mealTypeId}`,
  labelMr: `जेवणाचा प्रकार ${mealTypeId}`,
  icon: MealIcon,
});

// ─── BookOrderCard ────────────────────────────────────────────────────────────
const BookOrderCard = ({
  selectedItemIds = new Set(),
  onItemToggle,
  shift,
  onShiftChange,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [shiftOpen, setShiftOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [activeCategory, setActiveCategory] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [menuLoading, setMenuLoading] = useState(false);

  const shiftBtnRef = useRef(null);
  const rightPanelRef = useRef(null);

  const getItemName = (item) => {
    if (lang === "hi" && item.nameHi) return item.nameHi;
    if (lang === "mr" && item.nameMr) return item.nameMr;
    return item.nameEn;
  };

  const getCatLabel = (cat) => {
    if (lang === "hi") return cat.labelHi;
    if (lang === "mr") return cat.labelMr;
    return cat.labelEn;
  };

  // ── Fetch shifts + auto-select first ───────────────────────────────────────
  useEffect(() => {
    getShifts()
      .then((data) => {
        setShifts(data);
        const first =
          data.find((s) => s.shiftName?.toLowerCase().includes("morning")) ??
          data[0];
        if (first) onShiftChange(first);
      })
      .catch(() => {
        const fallback = [
          { shiftId: 1, shiftName: "1st Shift" },
          { shiftId: 2, shiftName: "2nd Shift" },
          { shiftId: 3, shiftName: "3rd Shift" },
          { shiftId: 4, shiftName: "General Shift" },
        ];
        setShifts(fallback);
        onShiftChange(fallback[0]);
      })
      .finally(() => setShiftsLoading(false));
  }, []);

  // ── Fetch allocation whenever shift changes ────────────────────────────────
  useEffect(() => {
    if (!shift?.shiftId) return;

    setMenuLoading(true);
    setCategories([]);
    setMenuItems({});
    setActiveCategory(null);

    getDayWiseFoodAllocation(shift.shiftId)
      .then((data) => {
        console.log("RAW ALLOCATION:", JSON.stringify(data, null, 2)); // ← HERE
        const { mealTypes = [] } = data;
        const cats = [];
        const grouped = {};

        mealTypes.forEach((mt) => {
          const config =
            MEAL_TYPE_CONFIG[mt.mealTypeId] ?? DEFAULT_CONFIG(mt.mealTypeId);
          const catKey = config.key;

          cats.push({
            key: catKey,
            labelEn: config.labelEn,
            labelHi: config.labelHi,
            labelMr: config.labelMr,
            icon: config.icon,
          });

          // Flatten all items across all menus inside this mealType
          const items = [];
          (mt.menus ?? []).forEach((menu) => {
            (menu.items ?? []).forEach((item) => {
              items.push({
                id: String(item.itemId),
                nameEn: item.itemEnglishName,
                nameHi: item.itemHindiName,
                nameMr: item.itemMarathiName,
                menuId: menu.menuId,
              });
            });
          });

          grouped[catKey] = items;
        });

        setCategories(cats);
        setMenuItems(grouped);
        if (cats.length > 0) setActiveCategory(cats[0].key);
      })
      .catch((err) => {
        console.error(
          "[BookOrderCard] getDayWiseFoodAllocation failed:",
          err.message,
        );
      })
      .finally(() => setMenuLoading(false));
  }, [shift?.shiftId]);

  const items = activeCategory ? (menuItems[activeCategory] ?? []) : [];

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    if (rightPanelRef.current) rightPanelRef.current.scrollTop = 0;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "18.13%",
        left: "5.65%",
        right: "5.65%",
        border: "1.5px solid #E5E7EB",
        borderRadius: "10px",
        background: "#FFFFFF",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <style>{`
        .menu-right-scroll::-webkit-scrollbar { width: 8px; }
        .menu-right-scroll::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 10px; }
        .menu-right-scroll::-webkit-scrollbar-thumb { background: #EA4D4E; border-radius: 10px; }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2.5% 5%",
          borderBottom: "1px solid #F3F4F6",
          minHeight: "52px",
        }}
      >
        <span
          style={{
            color: "#B91C1C",
            fontWeight: 700,
            fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
          }}
        >
          Book Your Order
        </span>

        {/* ── Shift pill ── */}
        {shift && (
          <div>
            <button
              ref={shiftBtnRef}
              onClick={() => {
                const rect = shiftBtnRef.current?.getBoundingClientRect();
                if (rect)
                  setDropdownPos({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right,
                  });
                setShiftOpen((p) => !p);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                border: "1.5px solid #079A3F",
                borderRadius: "20px",
                background: "#F0FDF4",
                color: "#079A3F",
                fontWeight: 500,
                fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {shift.shiftName}
              <span style={{ fontSize: "0.75em" }}>▾</span>
            </button>

            {shiftOpen && (
              <>
                <div
                  onClick={() => setShiftOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 998 }}
                />
                <div
                  style={{
                    position: "fixed",
                    top: dropdownPos.top,
                    right: dropdownPos.right,
                    background: "#FFFFFF",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "10px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    zIndex: 999,
                    minWidth: "160px",
                    overflow: "hidden",
                  }}
                >
                  {shifts.map((s) => (
                    <button
                      key={s.shiftId}
                      onClick={() => {
                        onShiftChange(s);
                        setShiftOpen(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "16px 28px",
                        background:
                          s.shiftId === shift.shiftId
                            ? "#FEF2F2"
                            : "transparent",
                        color:
                          s.shiftId === shift.shiftId ? "#B91C1C" : "#374151",
                        fontWeight: s.shiftId === shift.shiftId ? 600 : 500,
                        fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.shiftName}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
        <div
          style={{
            width: "26.41%",
            flexShrink: 0,
            borderRight: "1px solid #F3F4F6",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {menuLoading
            ? [1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    height: SIDEBAR_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #F3F4F6",
                    opacity: 0.4,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#E5E7EB",
                    }}
                  />
                </div>
              ))
            : categories.map((cat, idx, arr) => (
                <div
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  style={{
                    height: SIDEBAR_HEIGHT,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px 0",
                    borderLeft:
                      activeCategory === cat.key
                        ? "3px solid #B91C1C"
                        : "3px solid transparent",
                    background:
                      activeCategory === cat.key ? "#FFF0F0" : "transparent",
                    borderBottom:
                      idx < arr.length - 1 ? "1px solid #F3F4F6" : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <img
                    src={cat.icon}
                    alt={getCatLabel(cat)}
                    style={{
                      width: IMG_SIZE,
                      height: IMG_SIZE,
                      objectFit: "contain",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                      fontWeight: activeCategory === cat.key ? 700 : 500,
                      color: activeCategory === cat.key ? "#B91C1C" : "#1F2937",
                      margin: "8px 0 0 0",
                      textAlign: "center",
                      transition: "color 0.15s",
                    }}
                  >
                    {getCatLabel(cat)}
                  </p>
                </div>
              ))}
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
        <div
          ref={rightPanelRef}
          className="menu-right-scroll"
          style={{
            flex: 1,
            background: "#FFFFFF",
            maxHeight: `calc(${SIDEBAR_HEIGHT} * 3)`,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {menuLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: ROW_HEIGHT,
              }}
            >
              <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
                Loading menu...
              </p>
            </div>
          )}

          {!menuLoading && items.length === 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: ROW_HEIGHT,
              }}
            >
              <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
                No items available
              </p>
            </div>
          )}

          {!menuLoading &&
            items.map((item, index) => {
              const isSelected = selectedItemIds.has(item.id);
              return (
                <div key={item.id}>
                  <div
                    onClick={() => onItemToggle?.(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: ROW_HEIGHT,
                      paddingLeft: "32px",
                      paddingRight: "20px",
                      gap: "18px",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      background: isSelected ? "#FEF2F2" : "transparent",
                      transition: "background 0.15s",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)",
                          fontWeight: 700,
                          color: isSelected ? "#B91C1C" : "#A50000",
                          lineHeight: 1.3,
                        }}
                      >
                        {getItemName(item)}
                      </p>
                    </div>

                    {isSelected && (
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "#B91C1C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </span>
                      </div>
                    )}
                  </div>

                  {index < items.length - 1 && (
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(0,0,0,0.1)",
                        margin: "0 20px",
                      }}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BookOrderCard;
