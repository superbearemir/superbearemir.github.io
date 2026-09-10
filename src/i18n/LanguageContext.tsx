import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TRANSLATIONS, TranslationKey } from './translations';
import { CountryInfo, COUNTRIES, getCountryByCode } from './countriesData';

interface LanguageContextValue {
  language: Language;
  country: CountryInfo;
  setLanguage: (lang: Language) => void;
  setCountry: (countryCode: string) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_LANG_KEY = 'super_bear_selected_language_v1';
const STORAGE_COUNTRY_KEY = 'super_bear_selected_country_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'tr' || saved === 'en') return saved;
    // Default to Turkish as per project baseline, or browser detection
    return 'tr';
  });

  const [countryCode, setCountryCodeState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_COUNTRY_KEY) || 'TR';
  });

  const country = getCountryByCode(countryCode);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_LANG_KEY, newLang);
    (window as any).__superBearCurrentLang = newLang;
    window.dispatchEvent(new CustomEvent('superbear:language-changed', { detail: { lang: newLang } }));
  }, []);

  const setCountry = useCallback((code: string) => {
    const targetCountry = getCountryByCode(code);
    setCountryCodeState(targetCountry.code);
    localStorage.setItem(STORAGE_COUNTRY_KEY, targetCountry.code);
    // If the country has a default language recommendation and user didn't manually lock
    if (targetCountry.code === 'TR' || targetCountry.code === 'AZ' || targetCountry.code === 'CY') {
      setLanguage('tr');
    } else {
      setLanguage('en');
    }
  }, [setLanguage]);

  useEffect(() => {
    (window as any).__superBearCurrentLang = language;
  }, [language]);

  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (key in currentDict) {
      return (currentDict as any)[key];
    }
    if (key in TRANSLATIONS.en) {
      return (TRANSLATIONS.en as any)[key];
    }
    return fallback || (key as string);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, country, setLanguage, setCountry, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
