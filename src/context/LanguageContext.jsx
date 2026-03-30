// src\context\LanguageContext.jsx

import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import i18n, {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from "@/i18n";

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(
    () => i18n.language || DEFAULT_LANGUAGE,
  );

  /**
   * setLanguage — switches the active language globally.
   * Updates i18next, React state, and localStorage in one call.
   * @param {string} langCode - "en" | "hi" | "mr"
   */
  const setLanguage = useCallback((langCode) => {
    const isValid = SUPPORTED_LANGUAGES.some((l) => l.code === langCode);

    if (!isValid) {
      console.warn(`[LanguageContext] Unknown language code: "${langCode}"`);
      return;
    }

    i18n.changeLanguage(langCode);
    setLanguageState(langCode);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    } catch (err) {
      console.warn("[LanguageContext] Could not persist language:", err);
    }
  }, []);

  const value = {
    language,
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useLanguage — consume LanguageContext inside any component.
 * Must be used within <LanguageProvider>.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a <LanguageProvider>");
  }
  return context;
};

export default LanguageContext;
