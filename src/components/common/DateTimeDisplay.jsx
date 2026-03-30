// src/components/common/DateTimeDisplay.jsx
import { useState, useEffect } from "react";

// ─── OLD CODE (commented out) ─────────────────────────────────────────────────
// const DateTimeDisplay = () => {
//   const [dateTime, setDateTime] = useState({ date: "", day: "" });
//
//   useEffect(() => {
//     const updateDateTime = () => {
//       const now = new Date();
//       setDateTime({
//         date: now.toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//         day: now.toLocaleDateString("en-US", { weekday: "long" }),
//       });
//     };
//
//     updateDateTime();
//     const interval = setInterval(updateDateTime, 60000);
//     return () => clearInterval(interval);
//   }, []);
//
//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "clamp(11vh, 13.00vh, 15vh)",
//         right: "clamp(4.5vw, 6.0vw, 7.5vw)",
//         zIndex: 10,
//         display: "flex",
//         alignItems: "center",
//         gap: "clamp(1vw, 1.5vw, 2vw)",
//       }}
//     >
//       <span style={{ fontSize: "clamp(1.2rem, 2.0vw, 1.6rem)", color: "#6B7280" }}>•</span>
//       <span style={{ fontSize: "clamp(1.3rem, 2.30vw, 1.8rem)", fontWeight: 400, color: "#6B7280", whiteSpace: "nowrap" }}>
//         {dateTime.date}
//       </span>
//       <span style={{ fontSize: "clamp(1.3rem, 2.30vw, 1.8rem)", fontWeight: 400, color: "#6B7280", whiteSpace: "nowrap" }}>
//         {dateTime.day}
//       </span>
//     </div>
//   );
// };
// ─────────────────────────────────────────────────────────────────────────────

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState({
    date: "",
    day: "",
    time: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        date: now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        day: now.toLocaleDateString("en-US", { weekday: "long" }),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(11vh, 13.00vh, 15vh)",
        right: "clamp(4.5vw, 6.0vw, 7.5vw)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* Calendar icon + date + day */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#FEF2F2",
          border: "1.5px solid #FECACA",
          borderRadius: "10px",
          padding: "6px 14px",
        }}
      >
        {/* Calendar icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="3"
            stroke="#B91C1C"
            strokeWidth="2"
          />
          <path
            d="M16 2v4M8 2v4M3 10h18"
            stroke="#B91C1C"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <span
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
            fontWeight: 600,
            color: "#B91C1C",
            whiteSpace: "nowrap",
          }}
        >
          {dateTime.date}
        </span>

        {/* Divider */}
        <span style={{ color: "#FECACA", fontSize: "1rem" }}>|</span>

        <span
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
            fontWeight: 500,
            color: "#B91C1C",
            whiteSpace: "nowrap",
          }}
        >
          {dateTime.day}
        </span>
      </div>

      {/* Clock icon + time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#FEF2F2",
          border: "1.5px solid #FECACA",
          borderRadius: "10px",
          padding: "6px 14px",
        }}
      >
        {/* Clock icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#B91C1C" strokeWidth="2" />
          <path
            d="M12 7v5l3 3"
            stroke="#B91C1C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
            fontWeight: 600,
            color: "#B91C1C",
            whiteSpace: "nowrap",
          }}
        >
          {dateTime.time}
        </span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
