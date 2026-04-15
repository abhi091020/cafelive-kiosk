// src/components/common/BackButton.jsx

import { useNavigate } from "react-router-dom";
import backIcon from "@assets/back.svg";
import PropTypes from "prop-types";

const BackButton = ({ to = -1, onBack = null }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onBack === "function") onBack(); // run cleanup first
    navigate(to, { replace: true }); // always replace, never push
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "clamp(9vh, 11.00vh, 13vh)",
        left: "clamp(4vw, 5.5vw, 7vw)",
        zIndex: 10,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(38px, 4.5vw, 54px)",
        height: "clamp(38px, 4.5vw, 54px)",
        borderRadius: "50%",
        transition: "transform 0.18s ease, opacity 0.18s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <img
        src={backIcon}
        alt="Back"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
        onError={(e) => {
          e.currentTarget.src = "/src/assets/back.png";
        }}
      />
    </div>
  );
};

BackButton.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBack: PropTypes.func,
};

export default BackButton;
