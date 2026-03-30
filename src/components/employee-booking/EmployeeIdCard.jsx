// src/components/employee-booking/EmployeeIdCard.jsx

const EmployeeIdCard = ({ value }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "clamp(12px, 1.5vw, 20px)",
        boxShadow: "0px 5px 20px rgba(0,0,0,0.11)",
        padding: "clamp(1.5vh, 2.5vh, 2.5vh) clamp(2.5vw, 4vw, 5vw)",
        width: "clamp(400px, 88vw, 1100px)", // ← wider
        boxSizing: "border-box",
      }}
    >
      {/* Title */}
      <h2
        style={{
          margin: "0 0 clamp(1vh, 1.4vh, 1.8vh) 0",
          textAlign: "center",
          fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
          fontWeight: 600,
          color: "#570000",
          letterSpacing: "0.01em",
        }}
      >
        Enter Employee ID
      </h2>

      {/* Display — read-only, driven by NumPad */}
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "clamp(0.7vh, 1vh, 1.4vh) clamp(1.2vw, 1.8vw, 2vw)", // ← shorter padding
          background: "#F9F9F9",
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: "clamp(6px, 0.8vw, 10px)",
          fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
          fontWeight: 400,
          color: value ? "#1a1a1a" : "#aaaaaa",
          minHeight: "clamp(58px, 7.5vh, 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.12em",
        }}
      >
        {value || ""}
      </div>
    </div>
  );
};

export default EmployeeIdCard;
