// src/components/staff-home/ActionButtons.jsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@router/AppRouter";
import { useUser } from "@context/UserContext";

const ActionButtons = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();

  const isContractor = user?.userType === "contractor";

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
    backgroundColor: "#EA4D4E",
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
        top: "clamp(69vh, 71vh, 73vh)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: "clamp(300px, 45vw, 550px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.8vh, 1.0vh, 1.5vh)",
      }}
    >
      {isContractor ? (
        /* ── Contractor: Bulk Order only ── */
        <button
          onClick={() => navigate(ROUTES.BULK_BOOKING)}
          style={baseButtonStyle}
          {...pointerHandlers}
        >
          {t("staffHome.bulkBooking")}
        </button>
      ) : (
        /* ── Staff: Employee Booking + Guest Booking ── */
        <>
          <button
            onClick={() => navigate(ROUTES.EMPLOYEE_BOOKING)}
            style={baseButtonStyle}
            {...pointerHandlers}
          >
            {t("staffHome.employeeBooking")}
          </button>

          <button
            onClick={() => navigate(ROUTES.GUEST_BOOKING)}
            style={baseButtonStyle}
            {...pointerHandlers}
          >
            {t("staffHome.guestBooking")}
          </button>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
