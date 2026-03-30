// src/components/menu/BookOrderButton.jsx
// Pure layout block — no absolute positioning, lives inside the bottom wrapper

import { useNavigate } from "react-router-dom";

const BookOrderButton = ({ selectedItems = [] }) => {
  const navigate = useNavigate();
  const isEnabled = selectedItems.length > 0;

  const activeGradient = "linear-gradient(90deg, #EA4D4E 0%, #B91C1C 100%)";

  const handleBookMeal = () => {
    if (!isEnabled) return;
    setTimeout(() => {
      navigate("/order-success", { state: { items: selectedItems } });
    }, 150);
  };

  return (
    <button
      onClick={handleBookMeal}
      disabled={!isEnabled}
      style={{
        width: "100%",
        height: "87px",
        borderRadius: "14.64px",
        background: isEnabled ? activeGradient : "#E5E7EB",
        border: "none",
        cursor: isEnabled ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexShrink: 0,
        boxShadow: isEnabled ? "0 4px 18px rgba(234,77,78,0.35)" : "none",
        transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
      }}
      onMouseDown={(e) => {
        if (isEnabled) {
          e.currentTarget.style.transform = "scale(0.98)";
          e.currentTarget.style.background = "#CB0000";
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.background = isEnabled
          ? activeGradient
          : "#E5E7EB";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.background = isEnabled
          ? activeGradient
          : "#E5E7EB";
      }}
    >
      {/* Cart icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke={isEnabled ? "#fff" : "#9CA3AF"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          stroke={isEnabled ? "#fff" : "#9CA3AF"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 10a4 4 0 01-8 0"
          stroke={isEnabled ? "#fff" : "#9CA3AF"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span
        style={{
          color: isEnabled ? "#FFFFFF" : "#9CA3AF",
          fontSize: "1.4rem",
          fontWeight: 700,
          letterSpacing: "0.5px",
        }}
      >
        {isEnabled ? "Book Meal" : "Select an item to Book Meal"}
      </span>
    </button>
  );
};

export default BookOrderButton;
