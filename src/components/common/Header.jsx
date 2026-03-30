// src/components/common/Header.jsx
import CafeLiveLogo from "@assets/logos/newlogo.svg";
import BajajLogo from "@assets/logos/bajajfinallogo.svg";

const Header = () => {
  return (
    <>
      {/* ── CAFELIVE LOGO ── */}
      <img
        src={CafeLiveLogo}
        alt="CafeLive"
        style={{
          position: "absolute",
          top: "clamp(2.2vh, 3.2vh, 4.2vh)",
          left: "clamp(4.5vw, 6.0vw, 7.5vw)",
          width: "clamp(200px, 25.70vw, 320px)",
          height: "auto",
          zIndex: 10,
        }}
      />

      {/* ── BAJAJ MUKAND LOGO ── */}
      <img
        src={BajajLogo}
        alt="Bajaj Mukand"
        style={{
          position: "absolute",
          top: "clamp(2vh, 3.0vh, 4vh)",
          right: "clamp(4vw, 5.5vw, 7vw)",
          width: "clamp(110px, 15.0vw, 195px)",
          height: "auto",
          objectFit: "contain",
          zIndex: 10,
        }}
      />
    </>
  );
};

export default Header;
