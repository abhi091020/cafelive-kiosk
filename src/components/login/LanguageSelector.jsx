import { useLanguage } from "@context/LanguageContext";
import LanguageButton from "./LanguageButton";

const LanguageSelector = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.5)",
      }}
    >
      {supportedLanguages.map(({ code, label }, index) => (
        <div
          key={code}
          style={{
            borderTop: index > 0 ? "1px solid #000" : "none",
          }}
        >
          <LanguageButton
            label={label}
            isActive={language === code}
            onClick={() => setLanguage(code)}
          />
        </div>
      ))}
    </div>
  );
};

export default LanguageSelector;
