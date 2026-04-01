// src/components/login/ScanButton.jsx

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import readyToScanEn from "@assets/readytoscan.svg";
import readyToScanHi from "@assets/ReadyToScanHindi.svg";
import readyToScanMr from "@assets/ReadyToScanMarathi.svg";

const SCAN_IMAGES = {
  en: readyToScanEn,
  hi: readyToScanHi,
  mr: readyToScanMr,
};

const ScanButton = ({ onScan }) => {
  const { i18n } = useTranslation();
  const scanImg = SCAN_IMAGES[i18n.language] ?? readyToScanEn;

  return (
    <button
      onClick={onScan}
      style={{
        width: "100%",
        height: "100%",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "transform 0.1s ease, opacity 0.1s ease",
      }}
      onPointerDown={(e) => {
        e.currentTarget.style.transform = "scale(0.98)";
        e.currentTarget.style.opacity = "0.85";
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.opacity = "1";
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.opacity = "1";
      }}
    >
      <img
        src={scanImg}
        alt="Ready To Scan"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
          display: "block",
        }}
      />
    </button>
  );
};

ScanButton.propTypes = { onScan: PropTypes.func };
ScanButton.defaultProps = { onScan: () => {} };

export default ScanButton;