import PropTypes from "prop-types";

const LanguageButton = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "clamp(45px, 6vh, 95px)",
        boxSizing: "border-box",
        cursor: "pointer",
        outline: "none",
        border: "none",
        borderRadius: "0",
        background: isActive
          ? "rgba(90, 90, 90, 0.9)"
          : "rgba(70, 70, 70, 0.85)",
        color: "white",
        fontSize: "clamp(1rem, 2.8vw, 1.7rem)",
        fontWeight: isActive ? 700 : 400,
        letterSpacing: "0.03em",
        WebkitTapHighlightColor: "transparent",
        transition: "background 0.15s ease",
      }}
      onPointerDown={(e) => {
        e.currentTarget.style.background = "rgba(110,110,110,0.95)";
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.background = isActive
          ? "rgba(90,90,90,0.9)"
          : "rgba(70,70,70,0.85)";
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.background = isActive
          ? "rgba(90,90,90,0.9)"
          : "rgba(70,70,70,0.85)";
      }}
    >
      {label}
    </button>
  );
};

LanguageButton.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

LanguageButton.defaultProps = { isActive: false };

export default LanguageButton;
