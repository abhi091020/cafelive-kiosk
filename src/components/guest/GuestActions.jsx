// src/components/guest/GuestActions.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "@components/common/ConfirmDialog";
import { ROUTES } from "@router/AppRouter";

const GuestActions = ({ canPrint, onPrint, onCancel, reqId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

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
    e.currentTarget.style.backgroundColor = "#FFFFFF";
  };

  const handlePrintClick  = () => { if (canPrint) setShowConfirm(true); };
  const handleConfirmOk   = () => { setShowConfirm(false); onPrint?.(); navigate(ROUTES.ORDER_SUCCESS); };
  const handleConfirmCancel = () => { setShowConfirm(false); };

  const baseButtonStyle = {
    flex: 1,
    padding: "clamp(0.8vh, 1.0vh, 1.2vh) 0",
    borderRadius: "clamp(6px, 0.8vw, 10px)",
    fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    transition: "transform 0.1s ease, opacity 0.1s ease",
    letterSpacing: "0.02em",
  };

  return (
    <>
      <ConfirmDialog
        visible={showConfirm}
        message={`${t("guest.confirmGuest")} ${t("guest.requestId")}: ${reqId ?? "—"}?`}
        yesLabel={t("general.cancel")}
        noLabel={t("general.ok")}
        onYes={handleConfirmCancel}
        onNo={handleConfirmOk}
      />

      <div
        style={{
          position: "absolute",
          bottom: "clamp(80px, 11vh, 140px)",
          left: "clamp(60px, 10vw, 200px)",
          width: "clamp(250px, 84vw, 850px)",
          display: "flex",
          flexDirection: "row",
          gap: "clamp(12px, 2vw, 24px)",
          zIndex: 10,
        }}
      >
        {/* ── Print ── */}
        <button
          onClick={handlePrintClick}
          disabled={!canPrint}
          style={{
            ...baseButtonStyle,
            backgroundColor: "#EA4D4E",
            color: "#FFFFFF",
            border: "none",
            cursor: canPrint ? "pointer" : "not-allowed",
            opacity: canPrint ? 1 : 0.5,
          }}
          onPointerDown={(e) => { if (canPrint) handlePointerDown(e); }}
          onPointerUp={(e) => { if (canPrint) handlePointerUp(e); }}
          onPointerLeave={(e) => { if (canPrint) handlePointerUp(e); }}
        >
          {t("general.print")}
        </button>

        {/* ── Cancel ── */}
        <button
          onClick={onCancel}
          style={{
            ...baseButtonStyle,
            backgroundColor: "#FFFFFF",
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
    </>
  );
};

export default GuestActions;