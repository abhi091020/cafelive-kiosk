// src/i18n.js

/**
 * i18n.js — CafeLive KIOSK
 *
 * Internationalization configuration using react-i18next.
 *
 * Currently active: English only.
 * Hindi and Marathi shells are wired in but empty —
 * all missing keys automatically fall back to English via fallbackLng.
 *
 * When translations are ready:
 *   1. Fill in hi.json and mr.json with real translated content
 *   2. No code changes needed — i18next picks them up automatically
 *
 * Language is persisted to localStorage so the kiosk remembers the
 * last selected language across power cycles.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@locales/en.json";
import hi from "@locales/hi.json";
import mr from "@locales/mr.json";

// ─── Supported Languages ─────────────────────────────────────────────────────
// Add new languages here when ready. Code must match locale file name.

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "cafelive_lang";

// ─── Resolve persisted language ───────────────────────────────────────────────

const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const valid = SUPPORTED_LANGUAGES.some((l) => l.code === saved);
    return valid ? saved : DEFAULT_LANGUAGE;
  } catch {
    // localStorage unavailable (e.g. private mode) — fall back silently
    return DEFAULT_LANGUAGE;
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },

  lng: getSavedLanguage(),

  // Any key missing in hi/mr will automatically render in English
  fallbackLng: DEFAULT_LANGUAGE,

  interpolation: {
    // React already escapes output — disable double-escaping
    escapeValue: false,
  },

  // Only log missing keys in dev mode
  saveMissing: false,
  debug: import.meta.env.VITE_DEV_MODE === "true",
});

export default i18n;
