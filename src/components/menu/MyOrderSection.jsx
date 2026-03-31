// src/components/menu/MyOrderSection.jsx

import { useTranslation } from "react-i18next";

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#CB0000">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const MyOrderSection = ({
  selectedItems = [],
  onDelete,
  onIncrement,
  onDecrement,
  onQtyChange,
  bulkMode = false,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language; // "en" | "hi" | "mr"

  // ✅ Language-aware name — same logic as BookOrderCard
  const getItemName = (item) => {
    if (lang === "hi" && item.nameHi) return item.nameHi;
    if (lang === "mr" && item.nameMr) return item.nameMr;
    return item.nameEn || item.name || "";
  };

  if (!selectedItems.length) return null;

  return (
    <div style={{ width: "100%" }}>
      {/* ── Heading ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#050404",
            }}
          >
            My Order
          </p>
          <div
            style={{
              background: "#EA4D4E",
              color: "#fff",
              borderRadius: "20px",
              padding: "2px 12px",
              fontSize: "1.15rem",
              fontWeight: 700,
            }}
          >
            {selectedItems.length}{" "}
            {selectedItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        {bulkMode && (
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#EA4D4E" }}>
            Enter QTY.
          </span>
        )}
      </div>

      {/* ── Item rows ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {selectedItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#F9F9F9",
              borderRadius: "10px",
              minHeight: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              flexShrink: 0,
            }}
          >
            {/* ✅ Language-aware name */}
            <span
              style={{
                fontSize: "1.25rem",
                color: "#050404",
                fontWeight: 500,
                flex: 1,
              }}
            >
              {getItemName(item)}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {bulkMode ? (
                /* ── Bulk: typed QTY input ── */
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) onQtyChange?.(item.id, val);
                  }}
                  style={{
                    width: "clamp(60px, 8vw, 90px)",
                    height: "clamp(34px, 4vh, 44px)",
                    borderRadius: "8px",
                    border: "1.5px solid #E5E7EB",
                    textAlign: "center",
                    fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)",
                    fontWeight: 700,
                    color: "#050404",
                    outline: "none",
                    background: "#FFFFFF",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#EA4D4E")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
              ) : (
                /* ── Normal: +/- stepper ── */
                <>
                  <button
                    onClick={() => onDecrement?.(item.id)}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "#079A3F",
                      color: "#fff",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    −
                  </button>

                  <span
                    style={{
                      minWidth: "32px",
                      textAlign: "center",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      color: "#050404",
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => onIncrement?.(item.id)}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "#EA4D4E",
                      color: "#fff",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </button>
                </>
              )}

              <button
                onClick={() => onDelete?.(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "4px",
                }}
                aria-label={`Remove ${getItemName(item)}`}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrderSection;