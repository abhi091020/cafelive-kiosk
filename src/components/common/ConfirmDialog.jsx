// src/components/common/ConfirmDialog.jsx
// Reusable confirmation dialog — use anywhere across the app
//
// Usage:
//   <ConfirmDialog
//     visible={showDialog}
//     message={t("menu.addMoreMessage")}
//     yesLabel={t("general.yes")}
//     noLabel={t("general.no")}
//     onYes={() => { setShowDialog(false); }}
//     onNo={() => { setShowDialog(false); navigate("/order-success", ...); }}
//   />

import { useTranslation } from "react-i18next";

const ConfirmDialog = ({
  visible = false,
  message,
  yesLabel,
  noLabel,
  onYes,
  onNo,
}) => {
  const { t } = useTranslation();
  if (!visible) return null;

  // Fall back to translated defaults if labels not passed by parent
  const resolvedYes = yesLabel ?? t("general.yes");
  const resolvedNo  = noLabel  ?? t("general.no");
  const resolvedMsg = message  ?? t("general.confirm");

  const activeGradient = "linear-gradient(90deg, #EA4D4E 0%, #B91C1C 100%)";

  return (
    /* ── Overlay ──────────────────────────────────────────────────────── */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 5%",
      }}
    >
      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          backgroundColor: "#FFFFFF",
          borderRadius: "18px",
          padding: "52px 40px 44px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "36px",
          boxSizing: "border-box",
        }}
      >
        {/* ── Message ──────────────────────────────────────────────────── */}
        <p
          style={{
            margin: 0,
            fontSize: "1.65rem",
            fontWeight: 700,
            color: "#B91C1C",
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          {resolvedMsg}
        </p>

        {/* ── Buttons ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
          {/* Yes — outlined */}
          <button
            onClick={onYes}
            style={{
              flex: 1,
              height: "72px",
              borderRadius: "12px",
              border: "2px solid #B91C1C",
              backgroundColor: "#FFFFFF",
              color: "#B91C1C",
              fontSize: "1.4rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s, transform 0.1s",
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
              e.currentTarget.style.backgroundColor = "#FEE2E2";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            }}
          >
            {resolvedYes}
          </button>

          {/* No — filled red */}
          <button
            onClick={onNo}
            style={{
              flex: 1,
              height: "72px",
              borderRadius: "12px",
              border: "none",
              background: activeGradient,
              color: "#FFFFFF",
              fontSize: "1.4rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(185,28,28,0.35)",
              transition: "transform 0.1s",
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
              e.currentTarget.style.background = "#CB0000";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = activeGradient;
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = activeGradient;
            }}
          >
            {resolvedNo}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;