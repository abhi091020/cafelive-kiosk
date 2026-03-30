import { useTranslation } from "react-i18next";

const SplashFooter = () => {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        width: "100%",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "clamp(32px, 4.5vh, 56px)",
        padding: "0 clamp(1rem, 4vw, 2.5rem)",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <p
        style={{
          margin: 0,
          color: "white",
          fontSize: "clamp(0.7rem, 1.6vw, 1rem)",
          fontWeight: 400,
          letterSpacing: "0.03em",
          textAlign: "left",
          opacity: 0.85,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {t("splash.poweredBy", "Powered by DAccess Security Systems Pvt. Ltd")}
      </p>
    </footer>
  );
};

export default SplashFooter;
