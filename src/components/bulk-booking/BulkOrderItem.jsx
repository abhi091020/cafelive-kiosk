// src/components/bulk-booking/BulkOrderItem.jsx

import { useState } from "react";
import NumPad from "@components/shared/NumPad";

const TrashIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="#CB0000">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const BulkOrderItem = ({ item, onDelete, onQtyChange }) => {
  const [showNumPad, setShowNumPad] = useState(false);
  const [padValue, setPadValue] = useState("");

  const handleOpenNumPad = () => {
    setPadValue("");
    setShowNumPad(true);
  };

  const handleEnter = () => {
    const val = parseInt(padValue, 10);
    if (!isNaN(val) && val > 0) onQtyChange?.(item.id, val);
    setShowNumPad(false);
    setPadValue("");
  };

  const handleOverlayClick = () => {
    setShowNumPad(false);
    setPadValue("");
  };

  return (
    <>
      <div
        style={{
          background: "#F9F9F9",
          borderRadius: "10px",
          minHeight: "clamp(56px, 7vh, 72px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "1.25rem",
            color: "#050404",
            fontWeight: 500,
            flex: 1,
          }}
        >
          {item.name}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={handleOpenNumPad}
            style={{
              width: "clamp(64px, 9vw, 100px)",
              height: "clamp(36px, 4.5vh, 48px)",
              borderRadius: "8px",
              border: "1.5px solid #E5E7EB",
              textAlign: "center",
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
              fontWeight: 700,
              color: "#050404",
              background: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#EA4D4E";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(234,77,78,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {item.quantity}
          </div>

          <button
            onClick={() => onDelete?.(item.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
            aria-label={`Remove ${item.name}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {showNumPad && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px 32px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              minWidth: "clamp(320px, 50vw, 560px)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                fontWeight: 700,
                color: "#050404",
              }}
            >
              {item.name}
            </p>

            <div
              style={{
                width: "100%",
                height: "clamp(52px, 7vh, 72px)",
                borderRadius: "10px",
                border: "2px solid #EA4D4E",
                background: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: padValue ? "#050404" : "#D1D5DB",
                letterSpacing: "4px",
              }}
            >
              {padValue || "—"}
            </div>

            <NumPad
              value={padValue}
              onChange={setPadValue}
              onEnter={handleEnter}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOrderItem;
