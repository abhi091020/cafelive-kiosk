// src/components/bulk-booking/BulkOrderCard.jsx

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

// ─── Category images (fallbacks for known meal types by index) ────────────────
import MealImg from "@assets/meal/meal.png";
import SnacksImg from "@assets/meal/snacks.png";
import TeaCoffeeImg from "@assets/meal/teacoffee.png";
import BoxImg from "@assets/meal/box.png"; // generic fallback

const CATEGORY_IMAGES = [MealImg, SnacksImg, TeaCoffeeImg];

const getCategoryImage = (index) => CATEGORY_IMAGES[index] ?? BoxImg;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a display name for a menu entry.
 * The API returns items[] inside each menu; we join their names as a description
 * and use the first item's name (or a fallback) as the title.
 */
const buildMenuDisplay = (menu, lang = "en") => {
  const items = menu.items ?? [];

  const getName = (item) => {
    if (lang === "hi" && item.itemHindiName) return item.itemHindiName;
    if (lang === "mr" && item.itemMarathiName) return item.itemMarathiName;
    return item.itemEnglishName ?? `Menu ${menu.menuId}`;
  };

  const names = items.map(getName);
  return {
    name: names[0] ?? `Menu ${menu.menuId}`,
    desc: names.slice(1).join(", "),
  };
};

// ─── Sizing constants ─────────────────────────────────────────────────────────

const ROW_HEIGHT = "clamp(140px, 19vh, 210px)";
const SIDEBAR_HEIGHT = "clamp(140px, 19vh, 210px)";
const IMG_SIZE = "clamp(85px, 11.5vh, 135px)";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const Skeleton = ({
  width = "100%",
  height = "20px",
  radius = "6px",
  style = {},
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background:
        "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      flexShrink: 0,
      ...style,
    }}
  />
);

const shimmerCss = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyMenuState = ({ shift, t }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "32px",
      color: "#9CA3AF",
    }}
  >
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h12M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
        stroke="#D1D5DB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <p
      style={{
        margin: 0,
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#6B7280",
        textAlign: "center",
      }}
    >
      {shift
        ? (t("menu.noItemsForShift") ?? "No items available for this shift")
        : (t("menu.selectShiftFirst") ?? "Select a shift to view menu")}
    </p>
  </div>
);

// ─── BulkOrderCard ────────────────────────────────────────────────────────────

const BulkOrderCard = ({
  shifts = [],
  loadingShifts = false,
  shift = null, // { shiftId, shiftName }
  onShiftChange,
  menuData = { mealTypes: [] },
  loadingMenu = false,
  selectedItemIds = new Set(),
  onItemToggle,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) ?? "en"; // "en" | "hi" | "mr"

  const [shiftOpen, setShiftOpen] = useState(false);
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const rightPanelRef = useRef(null);

  const mealTypes = menuData?.mealTypes ?? [];

  // Reset active category index when menu data changes (new shift selected)
  // (we don't use useEffect here to keep it simple — just clamp the index)
  const safeCatIdx =
    mealTypes.length > 0 ? Math.min(activeCatIdx, mealTypes.length - 1) : 0;

  const activeMenus = mealTypes[safeCatIdx]?.menus ?? [];

  const handleCategoryChange = (idx) => {
    setActiveCatIdx(idx);
    if (rightPanelRef.current) rightPanelRef.current.scrollTop = 0;
  };

  // ── Category label: use mealTypeName if API provides it, else fallback ──────
  const getCategoryLabel = (mealType, idx) =>
    mealType.mealTypeName ?? mealType.name ?? `Category ${idx + 1}`;

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
        overflow: "hidden",
      }}
    >
      <style>{shimmerCss}</style>
      <style>{`
        .bulk-right-scroll::-webkit-scrollbar { width: 10px; }
        .bulk-right-scroll::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 10px; }
        .bulk-right-scroll::-webkit-scrollbar-thumb { background: #EA4D4E; border-radius: 10px; }
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
          {t("menu.bookYourOrder")}
        </span>

        {/* ── Shift Dropdown ──────────────────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => !loadingShifts && setShiftOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              border: `1.5px solid ${shift ? "#079A3F" : "#B91C1C"}`,
              borderRadius: "20px",
              background: shift ? "#F0FDF4" : "transparent",
              color: shift ? "#079A3F" : "#B91C1C",
              fontWeight: 500,
              fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
              cursor: loadingShifts ? "wait" : "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              minWidth: "160px",
              justifyContent: "space-between",
            }}
          >
            {loadingShifts
              ? (t("general.loading") ?? "Loading…")
              : (shift?.shiftName ?? t("menu.shiftSelection"))}
            <span style={{ fontSize: "0.75em", marginLeft: "4px" }}>
              {loadingShifts ? "⟳" : "▾"}
            </span>
          </button>

          {shiftOpen && !loadingShifts && shifts.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                background: "#FFFFFF",
                border: "1.5px solid #E5E7EB",
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                zIndex: 50,
                minWidth: "100%",
                overflow: "hidden",
              }}
            >
              {shifts.map((s) => (
                <button
                  key={s.shiftId}
                  onClick={() => {
                    onShiftChange?.(s); // pass full { shiftId, shiftName } object
                    setShiftOpen(false);
                    setActiveCatIdx(0);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    background:
                      s.shiftId === shift?.shiftId ? "#FEF2F2" : "transparent",
                    color: s.shiftId === shift?.shiftId ? "#B91C1C" : "#374151",
                    fontWeight: s.shiftId === shift?.shiftId ? 600 : 400,
                    fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Support both shiftName and name field from API */}
                  {s.shiftName ?? s.name ?? `Shift ${s.shiftId}`}
                </button>
              ))}
            </div>
          )}

          {shiftOpen && !loadingShifts && shifts.length === 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#9CA3AF",
                fontSize: "0.9rem",
                zIndex: 50,
                whiteSpace: "nowrap",
              }}
            >
              {t("shift.noShiftsAvailable") ?? "No shifts available"}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* ── LEFT SIDEBAR — Categories (mealTypes) ────────────────────── */}
        <div
          style={{
            width: "26.41%",
            flexShrink: 0,
            borderRight: "1px solid #F3F4F6",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loadingMenu
            ? /* skeleton categories */
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: SIDEBAR_HEIGHT,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "16px",
                    borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
                  }}
                >
                  <Skeleton width="72px" height="72px" radius="50%" />
                  <Skeleton width="80%" height="16px" />
                </div>
              ))
            : mealTypes.length > 0
              ? mealTypes.map((cat, idx, arr) => {
                  const isActive = idx === safeCatIdx;
                  return (
                    <div
                      key={cat.mealTypeId ?? idx}
                      onClick={() => handleCategoryChange(idx)}
                      style={{
                        height: SIDEBAR_HEIGHT,
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px 0",
                        borderLeft: isActive
                          ? "3px solid #B91C1C"
                          : "3px solid transparent",
                        background: isActive ? "#FFF0F0" : "transparent",
                        borderBottom:
                          idx < arr.length - 1 ? "1px solid #F3F4F6" : "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      <img
                        src={getCategoryImage(idx)}
                        alt={getCategoryLabel(cat, idx)}
                        style={{
                          width: IMG_SIZE,
                          height: IMG_SIZE,
                          objectFit: "contain",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#B91C1C" : "#1F2937",
                          margin: "8px 0 0 0",
                          textAlign: "center",
                          transition: "color 0.15s",
                          paddingInline: "8px",
                        }}
                      >
                        {getCategoryLabel(cat, idx)}
                      </p>
                    </div>
                  );
                })
              : /* placeholder when no shift selected yet */
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: SIDEBAR_HEIGHT,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
                      opacity: 0.35,
                    }}
                  >
                    <img
                      src={getCategoryImage(i)}
                      alt=""
                      style={{
                        width: IMG_SIZE,
                        height: IMG_SIZE,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ))}
        </div>

        {/* ── RIGHT PANEL — Menus for active category ───────────────────── */}
        <div
          ref={rightPanelRef}
          className="bulk-right-scroll"
          style={{
            flex: 1,
            background: "#FFFFFF",
            maxHeight: `calc(${SIDEBAR_HEIGHT} * 3)`,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {loadingMenu ? (
            /* skeleton menu rows */
            [0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: ROW_HEIGHT,
                  paddingInline: "32px",
                  gap: "18px",
                  borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <Skeleton width={IMG_SIZE} height={IMG_SIZE} radius="12px" />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Skeleton width="55%" height="22px" />
                  <Skeleton width="80%" height="16px" />
                </div>
              </div>
            ))
          ) : activeMenus.length > 0 ? (
            activeMenus.map((menu, index) => {
              // Each `menu` from the API = one bookable item (has menuId)
              const { name, desc } = buildMenuDisplay(menu, lang);
              const itemId = String(menu.menuId);
              const isSelected = selectedItemIds.has(itemId);

              return (
                <div key={menu.menuId}>
                  <div
                    onClick={() =>
                      onItemToggle?.({
                        id: itemId, // used as React key & local state key
                        menuId: menu.menuId, // sent to booking API
                        name,
                        desc,
                      })
                    }
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
                      src={getCategoryImage(safeCatIdx)}
                      alt={name}
                      style={{
                        width: IMG_SIZE,
                        height: IMG_SIZE,
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: desc ? "0 0 6px 0" : 0,
                          fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)",
                          fontWeight: 700,
                          color: isSelected ? "#B91C1C" : "#A50000",
                          lineHeight: 1.3,
                        }}
                      >
                        {name}
                      </p>
                      {desc && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "clamp(1rem, 1.6vw, 1.4rem)",
                            color: "#676666",
                            lineHeight: 1.5,
                          }}
                        >
                          {desc}
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

                  {index < activeMenus.length - 1 && (
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
            })
          ) : (
            <EmptyMenuState shift={shift} t={t} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkOrderCard;
