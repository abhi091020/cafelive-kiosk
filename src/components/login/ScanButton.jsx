//src\components\login\ScanButton.jsx
import PropTypes from "prop-types";
import readyToScanImg from "@assets/readytoscan.svg";

const ScanButton = ({ onScan }) => {
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
        src={readyToScanImg}
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
