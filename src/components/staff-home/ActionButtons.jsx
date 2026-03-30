// src/components/staff-home/ActionButtons.jsx
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@router/AppRouter";

const ActionButtons = () => {
  const navigate = useNavigate();

  const handleEmployeeBooking = () => {
    console.log("Employee Booking clicked");
    navigate(ROUTES.EMPLOYEE_BOOKING);
  };

  const handleGuestBooking = () => {
    console.log("Guest Booking clicked");
    navigate(ROUTES.GUEST_BOOKING);
  };

  const handleBulkOrderBooking = () => {
    console.log("Bulk Order Booking clicked");
    navigate(ROUTES.BULK_BOOKING);
  };

  const baseButtonStyle = {
    width: "100%",
    padding: "clamp(0.8vh, 1.0vh, 1.2vh) 0",
    border: "none",
    borderRadius: "clamp(6px, 8px, 10px)",
    fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
    fontWeight: 600,
    color: "#FFFFFF",
    cursor: "pointer",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    transition: "transform 0.1s ease, opacity 0.1s ease",
    letterSpacing: "0.02em",
  };

  const handlePointerDown = (e) => {
    e.currentTarget.style.transform = "scale(0.98)";
    e.currentTarget.style.opacity = "0.9";
    e.currentTarget.style.backgroundColor = "#CB0000";
  };

  const handlePointerUp = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.backgroundColor = "#EA4D4E";
  };

  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerUp,
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(69vh, 71vh, 73vh)", // ← anchors top of group, buttons grow downward
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: "clamp(300px, 45vw, 550px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.8vh, 1.0vh, 1.5vh)",
      }}
    >
      {/* Employee Booking */}
      <button
        onClick={handleEmployeeBooking}
        style={{ ...baseButtonStyle, backgroundColor: "#EA4D4E" }}
        {...pointerHandlers}
      >
        Employee Booking
      </button>

      {/* Guest Booking */}
      <button
        onClick={handleGuestBooking}
        style={{ ...baseButtonStyle, backgroundColor: "#EA4D4E" }}
        {...pointerHandlers}
      >
        Guest Booking
      </button>

      {/* Bulk Order Booking */}
      <button
        onClick={handleBulkOrderBooking}
        style={{ ...baseButtonStyle, backgroundColor: "#EA4D4E" }}
        {...pointerHandlers}
      >
        Bulk Order Booking
      </button>
    </div>
  );
};

export default ActionButtons;
