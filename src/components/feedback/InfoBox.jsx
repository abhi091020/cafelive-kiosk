// src/components/feedback/InfoBox.jsx

import StarRatingRow from "./StarRatingRow";

const InfoBox = ({
  categories = [],
  ratings,
  setRatings,
  onSubmit,
  onCancel,
  mealName,
  mealItems,
}) => {
  const handleChange = (key, val) =>
    setRatings((prev) => ({ ...prev, [key]: val }));

  return (
    <div
      style={{
        margin: "0 clamp(16px, 3.5vw, 50px)",
        borderRadius: "clamp(6px, 0.8vw, 12px)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        background: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* ── Meal Section (Food only) ─────────────────────────────── */}
      {(mealName || mealItems) && (
        <div
          style={{
            padding:
              "clamp(14px, 1.5vh, 28px) clamp(16px, 2.5vw, 40px) clamp(10px, 1vh, 20px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.07)",
          }}
        >
          {mealName && (
            <h3
              style={{
                margin: "0 0 clamp(4px, 0.5vh, 10px)",
                background: "linear-gradient(to right, #EA4D4E, #842B2C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "clamp(15px, 2.2vw, 28px)",
                fontWeight: 600,
                letterSpacing: "0.2px",
                lineHeight: 1.3,
              }}
            >
              {mealName}
            </h3>
          )}
          {mealItems && (
            <p
              style={{
                margin: 0,
                color: "#333333",
                fontSize: "clamp(12px, 1.7vw, 22px)",
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              {mealItems}
            </p>
          )}
        </div>
      )}

      {/* ── Rating Rows ─────────────────────────────────────────── */}
      <div>
        {categories.map(({ key, label }, index) => (
          <StarRatingRow
            key={key}
            label={label}
            value={ratings[key]}
            onChange={(val) => handleChange(key, val)}
            isLast={index === categories.length - 1}
          />
        ))}
      </div>

      {/* ── Action Buttons ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "clamp(10px, 1.5vw, 24px)",
          padding:
            "clamp(14px, 1.5vh, 28px) clamp(16px, 2.5vw, 40px) clamp(16px, 1.8vh, 32px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.07)",
        }}
      >
        {/* Submit */}
        <button
          onClick={onSubmit}
          style={{
            minWidth: "clamp(100px, 16vw, 210px)",
            height: "clamp(36px, 4vh, 64px)",
            borderRadius: "clamp(4px, 0.5vw, 8px)",
            border: "none",
            background: "#EA4D4E",
            color: "#FFFFFF",
            fontSize: "clamp(13px, 1.8vw, 22px)",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.3px",
            transition: "opacity 0.15s ease, transform 0.1s ease",
            WebkitTapHighlightColor: "transparent",
          }}
          onPointerDown={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "scale(0.98)";
            e.currentTarget.style.background = "#CB0000";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#EA4D4E";
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#EA4D4E";
          }}
        >
          Submit
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          style={{
            minWidth: "clamp(100px, 16vw, 210px)",
            height: "clamp(36px, 4vh, 64px)",
            borderRadius: "clamp(4px, 0.5vw, 8px)",
            border: "clamp(1px, 0.12vw, 2px) solid #EA4D4E",
            background: "transparent",
            color: "#EA4D4E",
            fontSize: "clamp(13px, 1.8vw, 22px)",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.3px",
            transition: "opacity 0.15s ease, transform 0.1s ease",
            WebkitTapHighlightColor: "transparent",
          }}
          onPointerDown={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "scale(0.98)";
            e.currentTarget.style.background = "#FEE2E2";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "transparent";
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InfoBox;
