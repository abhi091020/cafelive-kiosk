// src/components/menu/BookOrderCard.jsx

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@context/UserContext";
import { getShifts, getMenu } from "@services/api/menuAPI";

import MealIcon   from "@assets/meal/meal.png";
import SnacksIcon from "@assets/meal/snacks.png";
import TeaIcon    from "@assets/meal/teacoffee.png";

const ROW_HEIGHT     = "clamp(140px, 19vh, 210px)";
const SIDEBAR_HEIGHT = "clamp(140px, 19vh, 210px)";
const IMG_SIZE       = "clamp(85px, 11.5vh, 135px)";

// ─── Day helper ───────────────────────────────────────────────────────────────
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const getTodayName = () => DAY_NAMES[new Date().getDay()];

// ─── Map API mealTypeEnglishNames → sidebar category key ─────────────────────
const MEAL_TYPE_MAP = {
  lunch:        "meal",
  meal:         "meal",
  dinner:       "meal",
  breakfast:    "meal",
  snacks:       "snacks",
  snack:        "snacks",
  tea:          "tea_coffee",
  coffee:       "tea_coffee",
  "tea/coffee": "tea_coffee",
};

// ─── Map category key → icon ──────────────────────────────────────────────────
const ICON_MAP = {
  meal:       MealIcon,
  snacks:     SnacksIcon,
  tea_coffee: TeaIcon,
};

const getCategoryKey = (mealTypeEnglishNames = "") => {
  const lower = mealTypeEnglishNames.toLowerCase().trim();
  return MEAL_TYPE_MAP[lower] || "meal";
};

// ─── Shift-required placeholder ───────────────────────────────────────────────
const SelectShiftPlaceholder = ({ shifts, shiftsLoading, onShiftChange }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleOpen = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 8, left: rect.left });
    setOpen((p) => !p);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: `calc(${SIDEBAR_HEIGHT} * 3)`,
        gap: "16px",
        padding: "32px",
      }}
    >
      {/* Select Shift button — same style as ActionButtons */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={shiftsLoading}
        style={{
          width: "clamp(300px, 45vw, 550px)",
          padding: "clamp(0.8vh, 1.0vh, 1.2vh) 0",
          border: "none",
          borderRadius: "clamp(6px, 8px, 10px)",
          fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
          fontWeight: 600,
          color: "#FFFFFF",
          cursor: shiftsLoading ? "wait" : "pointer",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          transition: "transform 0.1s ease, opacity 0.1s ease",
          letterSpacing: "0.02em",
          backgroundColor: shiftsLoading ? "#E5E7EB" : "#EA4D4E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onPointerDown={(e) => {
          if (!shiftsLoading) {
            e.currentTarget.style.transform = "scale(0.98)";
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.backgroundColor = "#CB0000";
          }
        }}
        onPointerUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.backgroundColor = "#EA4D4E";
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.backgroundColor = "#EA4D4E";
        }}
      >
        {shiftsLoading ? t("general.loading") : t("menu.shiftSelection")}
        {!shiftsLoading && <span style={{ fontSize: "0.75em" }}>▾</span>}
      </button>

      {/* Fixed dropdown */}
      {open && !shiftsLoading && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
          <div
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              background: "#FFFFFF",
              border: "1.5px solid #E5E7EB",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              zIndex: 999,
              minWidth: "180px",
              overflow: "hidden",
            }}
          >
            {shifts.map((s) => (
              <button
                key={s.shiftId}
                onClick={() => { onShiftChange(s.shiftName); setOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px 28px",
                  background: "transparent",
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
                  border: "none",
                  borderBottom: "1px solid #F3F4F6",
                  cursor: "pointer",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {s.shiftName}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── BookOrderCard ────────────────────────────────────────────────────────────
const BookOrderCard = ({
  selectedItemIds = new Set(),
  onItemToggle,
  shift,
  onShiftChange,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language; // "en" | "hi" | "mr"

  // ✅ Get branchId from user session
  const { user } = useUser();
  const branchId = user?.branchId ?? null;

  const [shiftOpen,      setShiftOpen]      = useState(false);
  const [dropdownPos,    setDropdownPos]    = useState({ top: 0, right: 0 });
  const [activeCategory, setActiveCategory] = useState(null);
  const [shifts,         setShifts]         = useState([]);
  const [shiftsLoading,  setShiftsLoading]  = useState(true);
  const [categories,     setCategories]     = useState([]);
  const shiftBtnRef = useRef(null);
  const [menuItems,      setMenuItems]      = useState({});
  const [menuLoading,    setMenuLoading]    = useState(true);
  const [menuDate,       setMenuDate]       = useState(null); // from createdOn

  const rightPanelRef = useRef(null);

  // ✅ Language-aware item name
  const getItemName = (item) => {
    if (lang === "hi" && item.nameHi) return item.nameHi;
    if (lang === "mr" && item.nameMr) return item.nameMr;
    return item.nameEn;
  };

  // ✅ Language-aware category label
  const getCatLabel = (cat) => {
    if (lang === "hi" && cat.labelHi) return cat.labelHi;
    if (lang === "mr" && cat.labelMr) return cat.labelMr;
    return cat.labelEn;
  };

  // ── Fetch shifts ────────────────────────────────────────────────────────────
  useEffect(() => {
    getShifts()
      .then(setShifts)
      .catch(() =>
        setShifts([
          { shiftId: 1, shiftName: "1st Shift" },
          { shiftId: 2, shiftName: "2nd Shift" },
          { shiftId: 3, shiftName: "3rd Shift" },
          { shiftId: 4, shiftName: "General Shift" },
        ])
      )
      .finally(() => setShiftsLoading(false));
  }, []);

  // ── Fetch menu ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const today = getTodayName();
    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // ✅ Pass branchId to API
    getMenu(branchId)
      .then((rawItems) => {
        const active = rawItems.filter((item) => {
          if (!item.status) return false;

          const days = item.weekDay?.split(",").map((d) => d.trim()) ?? [];
          if (!days.includes(today)) return false;

          if (item.createdOn && item.createdOn !== todayDate) return false;

          return true;
        });

        const grouped  = {};
        const catMeta  = {};
        const catOrder = [];

        active.forEach((item) => {
          const catKey  = getCategoryKey(item.mealTypeEnglishNames);
          const typeId  = parseInt(item.mealTypeIds, 10) || 999;

          if (!grouped[catKey]) grouped[catKey] = [];

          if (!catMeta[catKey]) {
            catMeta[catKey] = {
              key:      catKey,
              labelEn:  item.mealTypeEnglishNames,
              labelHi:  item.mealTypeHindiNames,
              labelMr:  item.mealTypeMarathiNames,
              src:      ICON_MAP[catKey] || MealIcon,
              sortId:   typeId,
            };
            catOrder.push(catKey);
          }

          grouped[catKey].push({
            id:     String(item.menuId),
            nameEn: item.menuEnglishName,
            nameHi: item.menuHindiName,
            nameMr: item.menuMarathiName,
            img:    item.imagePath,
            desc:   item.typeOfMeal,
            raw:    item,
          });
        });

        const sortedKeys = catOrder.sort(
          (a, b) => (catMeta[a].sortId ?? 999) - (catMeta[b].sortId ?? 999)
        );

        if (active.length > 0 && active[0].createdOn) {
          setMenuDate(active[0].createdOn);
        }

        setCategories(sortedKeys.map((k) => catMeta[k]));
        setMenuItems(grouped);

        if (sortedKeys.length > 0) setActiveCategory(sortedKeys[0]);
      })
      .catch((err) => {
        console.error("❌ Menu failed:", err.message);
      })
      .finally(() => setMenuLoading(false));
  }, [branchId]);

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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#B91C1C", fontWeight: 700, fontSize: "clamp(1rem, 1.8vw, 1.4rem)" }}>
            Book Your Order
          </span>
          {menuDate && (
            <span style={{ color: "#9CA3AF", fontSize: "clamp(0.75rem, 1vw, 0.9rem)", fontWeight: 400 }}>
              {menuDate}
            </span>
          )}
        </div>

        {/* ── Shift dropdown — only visible AFTER shift is selected ───────── */}
        {shift && (
          <div>
            <button
              ref={shiftBtnRef}
              onClick={() => {
                const rect = shiftBtnRef.current?.getBoundingClientRect();
                if (rect) {
                  setDropdownPos({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right,
                  });
                }
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
              {shift}
              <span style={{ fontSize: "0.75em" }}>▾</span>
            </button>

            {shiftOpen && (
              <>
                {/* backdrop to close on outside click */}
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
                      onClick={() => { onShiftChange(s.shiftName); setShiftOpen(false); }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "16px 28px",
                        background: s.shiftName === shift ? "#FEF2F2" : "transparent",
                        color: s.shiftName === shift ? "#B91C1C" : "#374151",
                        fontWeight: s.shiftName === shift ? 600 : 500,
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

      {/* ── NO SHIFT SELECTED → show placeholder ───────────────────────── */}
      {!shift ? (
        <div style={{ borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
          <SelectShiftPlaceholder
            shifts={shifts}
            shiftsLoading={shiftsLoading}
            onShiftChange={onShiftChange}
          />
        </div>
      ) : (
        /* ── SHIFT SELECTED → show sidebar + menu ──────────────────────── */
        <div style={{ display: "flex", alignItems: "flex-start", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>

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
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#E5E7EB" }} />
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
                      borderLeft: activeCategory === cat.key ? "3px solid #B91C1C" : "3px solid transparent",
                      background: activeCategory === cat.key ? "#FFF0F0" : "transparent",
                      borderBottom: idx < arr.length - 1 ? "1px solid #F3F4F6" : "none",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <img
                      src={cat.src}
                      alt={getCatLabel(cat)}
                      style={{ width: IMG_SIZE, height: IMG_SIZE, objectFit: "contain" }}
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: ROW_HEIGHT }}>
                <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>Loading menu...</p>
              </div>
            )}

            {!menuLoading && items.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: ROW_HEIGHT }}>
                <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>No items available</p>
              </div>
            )}

            {!menuLoading && items.map((item, index) => {
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
                    <img
                      src={item.img}
                      alt={item.nameEn}
                      style={{
                        width: IMG_SIZE,
                        height: IMG_SIZE,
                        objectFit: "contain",
                        flexShrink: 0,
                        borderRadius: "8px",
                      }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />

                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: item.desc ? "0 0 6px 0" : 0,
                          fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)",
                          fontWeight: 700,
                          color: isSelected ? "#B91C1C" : "#A50000",
                          lineHeight: 1.3,
                        }}
                      >
                        {getItemName(item)}
                      </p>
                      {item.desc && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "clamp(1rem, 1.6vw, 1.4rem)",
                            color: "#676666",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.desc}
                        </p>
                      )}
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
                        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>✓</span>
                      </div>
                    )}
                  </div>

                  {index < items.length - 1 && (
                    <div style={{ height: "1px", background: "rgba(0,0,0,0.1)", margin: "0 20px" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookOrderCard;