import React, { createContext, useContext, useState, useEffect } from "react";
import { KRISHI_LANGUAGES, KRISHI_TRANSLATIONS } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    // Check saved language
    const saved = localStorage.getItem("krishi_lang");
    if (saved && KRISHI_TRANSLATIONS[saved]) {
      return saved;
    }
    // Check user preferences if saved
    try {
      const prefs = localStorage.getItem("krishi_preferences");
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.language && KRISHI_TRANSLATIONS[parsed.language]) {
          return parsed.language;
        }
      }
    } catch {
      /* ignore */
    }
    return "hi"; // Default to Hindi as per Krishi AI specs
  });

  const setLanguage = (langCode) => {
    if (!KRISHI_TRANSLATIONS[langCode]) {
      console.warn(`[i18n] Language ${langCode} not supported, falling back to 'hi'`);
      langCode = "hi";
    }
    setLanguageState(langCode);
    localStorage.setItem("krishi_lang", langCode);
    if (typeof document !== "undefined") {
      document.documentElement.lang = langCode;
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  /**
   * Translate a key with optional fallback.
   * Priority: current language -> English -> provided fallback -> key string
   */
  const t = (key, fallback = "") => {
    const dict = KRISHI_TRANSLATIONS[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    if (KRISHI_TRANSLATIONS.en && KRISHI_TRANSLATIONS.en[key]) {
      return KRISHI_TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: KRISHI_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
