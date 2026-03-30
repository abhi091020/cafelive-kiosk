// src/components/feedback/FeedbackButtons.jsx

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@router/AppRouter";

const FeedbackButtons = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const buttonStyle = {
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

  return (
    <div
      style={{
        position: "absolute",
        bottom: "clamp(15vh, 17vh, 19vh)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: "clamp(300px, 45vw, 550px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.8vh, 1.0vh, 1.5vh)",
      }}
    >
      {/* Food Feedback Button */}
      <button
        onClick={() => navigate(ROUTES.FEEDBACK_FOOD)}
        style={{ ...buttonStyle, backgroundColor: "#EA4D4E" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {t("feedback.foodFeedback")}
      </button>

      {/* Overall Feedback Button */}
      <button
        onClick={() => navigate(ROUTES.FEEDBACK_OVERALL)}
        style={{ ...buttonStyle, backgroundColor: "#EA4D4E" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {t("feedback.overallFeedback")}
      </button>
    </div>
  );
};

export default FeedbackButtons;