// src/components/menu/BookOrderCard.jsx

import { useState, useRef } from "react";

import SimpleVegMeal from "@assets/meal/simplevegmeal.png";
import SpecialVegMeal from "@assets/meal/specialvegmeal.png";
import NonVegMeal from "@assets/meal/nonvegmeal.png";
import HelpingMeal from "@assets/meal/helpingmeal.png";

import VadaPav from "@assets/meal/vadapav.png";
import Banana from "@assets/meal/banana.png";
import Paav from "@assets/meal/paav.png";
import Biscuit from "@assets/meal/biscuit.png";

import Tea from "@assets/meal/tea.png";
import Coffee from "@assets/meal/coffee.png";
import SpecialTea from "@assets/meal/specialtea.png";

const SHIFTS = ["1st Shift", "2nd Shift", "3rd Shift", "General Shift"];

const MENU_ITEMS = {
  meal: [
    {
      id: "meal_1",
      img: SimpleVegMeal,
      name: "Simple Veg Meal",
      desc: "Mungdal Khir, aloo Palak, Masur, Chapati",
    },
    {
      id: "meal_2",
      img: SpecialVegMeal,
      name: "Special Veg Meal",
      desc: "vegetable sweet corn, padwal chana, dudhi kofta, steamed, dal tadka, chapati, gulab jamun",
    },
    {
      id: "meal_3",
      img: NonVegMeal,
      name: "Non-veg Meal",
      desc: "Fruit custard, Chicken Curry, Chapati",
    },
    {
      id: "meal_4",
      img: HelpingMeal,
      name: "Helping Meal",
      desc: "Bananas, Curd",
    },
  ],
  snacks: [
    { id: "snack_1", img: VadaPav, name: "Snacks", desc: "Vada Pav" },
    { id: "snack_2", img: Banana, name: "Half Snacks", desc: "Banana" },
    { id: "snack_3", img: Paav, name: "Paav", desc: "" },
    { id: "snack_4", img: Biscuit, name: "Biscuit", desc: "" },
  ],
  tea_coffee: [
    { id: "tc_1", img: Tea, name: "Tea", desc: "" },
    { id: "tc_2", img: Coffee, name: "Coffee", desc: "" },
    { id: "tc_3", img: SpecialTea, name: "Special Tea", desc: "" },
  ],
};

const ROW_HEIGHT = "clamp(140px, 19vh, 210px)";
const SIDEBAR_HEIGHT = "clamp(140px, 19vh, 210px)";
const IMG_SIZE = "clamp(85px, 11.5vh, 135px)";

const BookOrderCard = ({
  selectedItemIds = new Set(),
  onItemToggle,
  shift,
  onShiftChange,
}) => {
  const [shiftOpen, setShiftOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("meal");
  const rightPanelRef = useRef(null);

  const items = MENU_ITEMS[activeCategory] || [];

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
        overflow: "hidden",
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
          Book Your Order...!
        </span>

        {/* Shift dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShiftOpen((p) => !p)}
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
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {shift ?? "Shift Selection"}
            <span style={{ fontSize: "0.75em" }}>▾</span>
          </button>

          {shiftOpen && (
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
              {SHIFTS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onShiftChange(s);
                    setShiftOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    background: s === shift ? "#FEF2F2" : "transparent",
                    color: s === shift ? "#B91C1C" : "#374151",
                    fontWeight: s === shift ? 600 : 400,
                    fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
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
          {[
            { key: "meal", label: "Meal", src: "/src/assets/meal/meal.png" },
            {
              key: "snacks",
              label: "Snacks",
              src: "/src/assets/meal/snacks.png",
            },
            {
              key: "tea_coffee",
              label: "Tea / Coffee",
              src: "/src/assets/meal/teacoffee.png",
            },
          ].map((cat, idx, arr) => (
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
                src={cat.src}
                alt={cat.label}
                style={{
                  width: IMG_SIZE,
                  height: IMG_SIZE,
                  objectFit: "contain",
                }}
              />
              <p
                style={{
                  fontSize: "clamp(1.2rem, 2vw, 1.7rem)", // ← increased
                  fontWeight: activeCategory === cat.key ? 700 : 500,
                  color: activeCategory === cat.key ? "#B91C1C" : "#1F2937",
                  margin: "8px 0 0 0",
                  textAlign: "center",
                  transition: "color 0.15s",
                }}
              >
                {cat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── RIGHT PANEL (scrollable) ──────────────────────────────────── */}
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
          {items.map((item, index) => {
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
                    borderLeft: "none",

                    transition: "background 0.15s, border-color 0.15s",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
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
                        margin: item.desc ? "0 0 6px 0" : 0,
                        fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)", // ← increased
                        fontWeight: 700,
                        color: isSelected ? "#B91C1C" : "#A50000",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </p>
                    {item.desc && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "clamp(1rem, 1.6vw, 1.4rem)", // ← increased
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
