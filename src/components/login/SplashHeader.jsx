//src\components\login\SplashHeader.jsx
import CafeLiveLogo from "@assets/cafelive.png";
import BajajLogo from "@assets/bajajlogo.png";

const SplashHeader = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "clamp(0.75rem, 2vh, 1.25rem) clamp(1rem, 3vw, 1.75rem)",
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        flexShrink: 0,
      }}
    >
      {/* CafeLive logo */}
      <img
        src={CafeLiveLogo}
        alt="CafeLive"
        style={{
          height: "clamp(28px, 3.5vh, 44px)",
          width: "auto",
          flexShrink: 0,
        }}
      />

      {/* Two separate white boxes — BAJAJ | MUKAND */}
      <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
        {/* BAJAJ box */}
        <div
          style={{
            background: "white",
            borderRadius: "4px 0 0 4px",
            padding: "4px 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "clamp(36px, 4.5vh, 56px)",
          }}
        >
          <img
            src={BajajLogo}
            alt="Bajaj"
            style={{ height: "clamp(24px, 3vh, 40px)", width: "auto" }}
          />
        </div>
        {/* MUKAND text box */}
        <div
          style={{
            background: "white",
            borderRadius: "0 4px 4px 0",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "clamp(36px, 4.5vh, 56px)",
          }}
        >
          <span
            style={{
              color: "#003087",
              fontWeight: 800,
              fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
              letterSpacing: "0.05em",
            }}
          >
            MUKAND
          </span>
        </div>
      </div>
    </header>
  );
};

export default SplashHeader;
