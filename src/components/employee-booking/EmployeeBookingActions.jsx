// src/components/employee-booking/EmployeeBookingActions.jsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@router/AppRouter";

const EmployeeBookingActions = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCancel = () => {
    navigate(ROUTES.STAFF_HOME);
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

  const handlePointerDownCancel = (e) => {
    e.currentTarget.style.transform = "scale(0.98)";
    e.currentTarget.style.opacity = "0.9";
    e.currentTarget.style.backgroundColor = "#FEE2E2";
  };

  const handlePointerUpCancel = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const baseStyle = {
    flex: 1,
    padding: "clamp(0.6vh, 0.9vh, 1.2vh) 0",
    border: "none",
    borderRadius: "clamp(6px, 0.8vw, 10px)",
    fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    transition: "transform 0.1s ease, opacity 0.1s ease",
    letterSpacing: "0.02em",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "clamp(10px, 1.5vw, 20px)",
        justifyContent: "center",
        width: "clamp(300px, 60vw, 700px)",
      }}
    >
      {/* Submit — filled red */}
      <button
        onClick={onSubmit}
        style={{
          ...baseStyle,
          backgroundColor: "#EA4D4E",
          color: "#FFFFFF",
          border: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {t("general.submit")}
      </button>

      {/* Cancel — outlined red */}
      <button
        onClick={handleCancel}
        style={{
          ...baseStyle,
          backgroundColor: "transparent",
          color: "#EA4D4E",
          border: "2px solid #EA4D4E",
        }}
        onPointerDown={handlePointerDownCancel}
        onPointerUp={handlePointerUpCancel}
        onPointerLeave={handlePointerUpCancel}
      >
        {t("general.cancel")}
      </button>
    </div>
  );
};

export default EmployeeBookingActions;