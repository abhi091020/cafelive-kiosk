// src\components\shared\NumPad.jsx

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "Enter"],
];

const NumPad = ({ onChange, onEnter, value }) => {
  const handleKey = (key) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
    } else if (key === "Enter") {
      onEnter();
    } else {
      onChange(value + key);
    }
  };

  const handlePointerDown = (e) => {
    e.currentTarget.style.opacity = "0.75";
    e.currentTarget.style.transform = "scale(0.96)";
  };

  const handlePointerUp = (e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div
      style={{
        width: "clamp(500px, 80vw, 800px)", // ← wider, matches card
        background: "#F5F5F5",
        borderRadius: "clamp(10px, 1.2vw, 14px)",
        boxShadow: "0px 5px 40px rgba(0,0,0,0.10)",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {keys.map((row, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          {row.map((key) => {
            const isEnter = key === "Enter";
            const isBackspace = key === "⌫";

            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{
                  padding: "clamp(1.8vh, 2.5vh, 3.2vh) 0",
                  border: "none",
                  borderTop: rowIdx > 0 ? "1px solid rgba(0,0,0,0.08)" : "none",
                  borderRight: "1px solid rgba(0,0,0,0.08)",
                  background: isEnter ? "#EA4D4E" : "#FFFFFF",
                  color: isEnter ? "#FFFFFF" : "#1a1a1a",
                  fontSize: isEnter
                    ? "clamp(1.6rem, 2.8vw, 2.4rem)"
                    : "clamp(1.8rem, 3.2vw, 2.8rem)",
                  fontWeight: isEnter ? 700 : 400,
                  cursor: "pointer",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                  transition: "opacity 0.1s ease, transform 0.1s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
              >
                {isBackspace ? (
                  <svg
                    width="clamp(24px, 3vw, 36px)"
                    height="clamp(18px, 2.2vw, 26px)"
                    viewBox="0 0 36 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H34C35.1 2 36 2.9 36 4V22C36 23.1 35.1 24 34 24H14L2 13L14 2Z"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="16"
                      y1="9"
                      x2="28"
                      y2="17"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="28"
                      y1="9"
                      x2="16"
                      y2="17"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default NumPad;
