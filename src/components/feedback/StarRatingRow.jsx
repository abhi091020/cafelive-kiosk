// src/components/feedback/StarRatingRow.jsx

import { useState } from "react";

const StarRatingRow = ({ label, value = 0, onChange, isLast = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: "clamp(10px, 1.2vh, 22px) clamp(16px, 2.5vw, 40px)",
        borderBottom: isLast ? "none" : "1px solid rgba(0, 0, 0, 0.07)",
        gap: "clamp(8px, 1.2vw, 20px)",
      }}
    >
      {/* Bullet */}
      <span
        style={{
          flexShrink: 0,
          color: "#1a1a1a",
          fontSize: "clamp(14px, 1.8vw, 24px)",
          fontFamily: "'Montserrat', sans-serif",
          lineHeight: 1,
        }}
      >
        •
      </span>

      {/* Label */}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          color: "#1a1a1a",
          fontSize: "clamp(14px, 1.9vw, 26px)",
          fontWeight: 600,
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "0.2px",
          lineHeight: 1.3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>

      {/* Stars */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: "clamp(6px, 1.4vw, 22px)",
        }}
      >
        {[1, 2, 3, 4].map((star) => (
          <span
            key={star}
            role="button"
            aria-label={`Rate ${star} star`}
            onClick={() => onChange?.(star)}
            onPointerEnter={() => setHover(star)}
            onPointerLeave={() => setHover(0)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "clamp(36px, 4.8vw, 64px)",
              minHeight: "clamp(36px, 4.8vw, 64px)",
              fontSize: "clamp(1.6rem, 3.5vw, 4.2rem)",
              cursor: "pointer",
              color: star <= (hover || value) ? "#FFC335" : "#DBDBDB",
              transition: "color 0.15s ease, transform 0.1s ease",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              lineHeight: 1,
            }}
            onPointerDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default StarRatingRow;
