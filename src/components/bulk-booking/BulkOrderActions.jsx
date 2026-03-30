// src/components/bulk-booking/BulkOrderActions.jsx

const CartIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 10a4 4 0 01-8 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const activeGradient = "linear-gradient(90deg, #EA4D4E 0%, #B91C1C 100%)";

const BulkOrderActions = ({ isEnabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      style={{
        width: "100%",
        height: "clamp(60px, 8vh, 100px)",
        borderRadius: "clamp(10px, 1.2vw, 16px)",
        flexShrink: 0,
        background: isEnabled ? activeGradient : "#E5E7EB",
        border: "none",
        cursor: isEnabled ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        boxShadow: isEnabled ? "0 4px 18px rgba(234,77,78,0.35)" : "none",
        transition: "background 0.2s, transform 0.1s",
        marginTop: isEnabled ? 0 : "auto",
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
      <CartIcon color={isEnabled ? "#fff" : "#9CA3AF"} />
      <span
        style={{
          color: isEnabled ? "#FFFFFF" : "#9CA3AF",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "0.5px",
        }}
      >
        {isEnabled ? "BOOK MEAL" : "Select an item to Book Meal"}
      </span>
    </button>
  );
};

export default BulkOrderActions;
