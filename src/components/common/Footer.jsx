// src/components/common/Footer.jsx

const Footer = () => {
  return (
    <footer
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#A30000",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "clamp(0.8vh, 1.0vh, 1.2vh) clamp(4vw, 5.0vw, 6vw)",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      <p
        style={{
          margin: 0,
          color: "white",
          fontSize: "clamp(1rem, 2.0vw, 1.5rem)",
          fontWeight: 500,
          letterSpacing: "0.02em",
          textAlign: "left",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Powered by DAccess Security Systems Pvt. Ltd
      </p>
    </footer>
  );
};

export default Footer;
