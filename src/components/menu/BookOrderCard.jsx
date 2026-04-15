// src/components/menu/BookOrderCard.jsx

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getShifts, getDayWiseFoodAllocation } from "@services/api/menuAPI";

const ROW_HEIGHT = "clamp(140px, 19vh, 210px)";
const SIDEBAR_HEIGHT = "clamp(140px, 19vh, 210px)";
const IMG_SIZE = "clamp(85px, 11.5vh, 135px)";

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
  const [shiftsError, setShiftsError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(false);

  const shiftBtnRef = useRef(null);
  const rightPanelRef = useRef(null);

  // ── Language helpers ──────────────────────────────────────────────────────
  const getName = (en, hi, mr) => {
    if (lang === "hi" && hi) return hi;
    if (lang === "mr" && mr) return mr;
    return en;
  };

  const getCatLabel = (cat) => getName(cat.labelEn, cat.labelHi, cat.labelMr);

  // ── Fetch shifts ──────────────────────────────────────────────────────────
  useEffect(() => {
    setShiftsLoading(true);
    setShiftsError(false);
    getShifts()
      .then((data) => {
        if (!data || data.length === 0) {
          setShiftsError(true);
          return;
        }
        setShifts(data);
        const first =
          data.find((s) => s.shiftName?.toLowerCase().includes("morning")) ??
          data[0];
        if (first) onShiftChange(first);
      })
      .catch((err) => {
        console.error("[BookOrderCard] getShifts failed:", err.message);
        setShiftsError(true);
      })
      .finally(() => setShiftsLoading(false));
  }, []);

  // ── Fetch menu ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shift?.shiftId) return;
    setMenuLoading(true);
    setMenuError(false);
    setCategories([]);
    setMenuItems({});
    setActiveCategory(null);

    getDayWiseFoodAllocation(shift.shiftId)
      .then((data) => {
        const { mealTypes = [] } = data;
        if (mealTypes.length === 0) return;

        const cats = [];
        const grouped = {};

        mealTypes.forEach((mt) => {
          const catKey = `meal_type_${mt.mealTypeId}`;

          // ── Each menu becomes ONE selectable row ──────────────────────
          const menus = (mt.menus ?? []).map((menu) => ({
            id: String(menu.menuId),
            nameEn: menu.menuEnglishName,
            nameHi: menu.menuHindiName,
            nameMr: menu.menuMarathiName,
            menuImage: menu.menuImage ?? null,
            // Build the subtitle from item names
            items: (menu.items ?? []).map((item) => ({
              nameEn: item.itemEnglishName,
              nameHi: item.itemHindiName,
              nameMr: item.itemMarathiName,
            })),
          }));

          cats.push({
            key: catKey,
            labelEn: mt.mealEnglishName,
            labelHi: mt.mealHindiName,
            labelMr: mt.mealMarathiName,
            categoryImage: mt.mealImage ?? null,
          });

          grouped[catKey] = menus;
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
        setMenuError(true);
      })
      .finally(() => setMenuLoading(false));
  }, [shift?.shiftId]);

  const rows = activeCategory ? (menuItems[activeCategory] ?? []) : [];

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

        {shiftsLoading && (
          <div style={{ color: "#9CA3AF", fontSize: "0.95rem" }}>
            Loading shifts...
          </div>
        )}

        {!shiftsLoading && shiftsError && (
          <div
            style={{
              color: "#B91C1C",
              fontSize: "0.9rem",
              fontWeight: 600,
              padding: "6px 14px",
              border: "1.5px solid #FECACA",
              borderRadius: "8px",
              background: "#FEF2F2",
            }}
          >
            ⚠ Could not load shifts — check network
          </div>
        )}

        {!shiftsLoading && !shiftsError && shift && (
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
                  {cat.categoryImage && (
                    <img
                      src={cat.categoryImage}
                      alt={getCatLabel(cat)}
                      style={{
                        width: IMG_SIZE,
                        height: IMG_SIZE,
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                      fontWeight: activeCategory === cat.key ? 700 : 500,
                      color: activeCategory === cat.key ? "#B91C1C" : "#1F2937",
                      margin: cat.categoryImage ? "8px 0 0 0" : "0",
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

          {!menuLoading && menuError && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: ROW_HEIGHT,
                gap: "8px",
              }}
            >
              <p
                style={{
                  color: "#B91C1C",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                ⚠ Could not load menu
              </p>
              <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                Check network or contact admin
              </p>
            </div>
          )}

          {!menuLoading && !menuError && rows.length === 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: ROW_HEIGHT,
              }}
            >
              <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
                No items available for today
              </p>
            </div>
          )}

          {/* ── Menu rows: image + name + items subtitle ── */}
          {!menuLoading &&
            !menuError &&
            rows.map((menu, index) => {
              const isSelected = selectedItemIds.has(menu.id);
              const menuName = getName(menu.nameEn, menu.nameHi, menu.nameMr);
              const subtitle = menu.items
                .map((item) => getName(item.nameEn, item.nameHi, item.nameMr))
                .join(", ");

              return (
                <div key={menu.id}>
                  <div
                    onClick={() => onItemToggle?.(menu)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: ROW_HEIGHT,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      gap: "18px",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      background: isSelected ? "#FEF2F2" : "transparent",
                      transition: "background 0.15s",
                      userSelect: "none",
                    }}
                  >
                    {/* ── Circular menu image ── */}
                    {menu.menuImage && (
                      <img
                        src={menu.menuImage}
                        alt={menuName}
                        style={{
                          width: IMG_SIZE,
                          height: IMG_SIZE,
                          objectFit: "cover",
                          borderRadius: "50%", // ← circle like Figma
                          flexShrink: 0,
                          border: isSelected
                            ? "2.5px solid #B91C1C"
                            : "2.5px solid transparent",
                          transition: "border 0.15s",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Menu name */}
                      <p
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)",
                          fontWeight: 700,
                          color: isSelected ? "#B91C1C" : "#A50000",
                          lineHeight: 1.3,
                        }}
                      >
                        {menuName}
                      </p>

                      {/* Items subtitle */}
                      {subtitle && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "clamp(0.85rem, 1.3vw, 1.1rem)",
                            color: "#6B7280",
                            fontWeight: 400,
                            lineHeight: 1.4,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {subtitle}
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

                  {index < rows.length - 1 && (
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
