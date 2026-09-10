import React, { useState, useMemo } from 'react';
import { Globe, Search, Check, X, Languages, Sparkles } from 'lucide-react';
import { COUNTRIES } from '../i18n/countriesData';
import { useLanguage } from '../i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../i18n/translations';

interface CountryLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountryLanguageModal: React.FC<CountryLanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, country, setLanguage, setCountry, t } = useLanguage();
  const [search, setSearch] = useState('');

  // Alphabetically sorted countries list with search filtering
  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.nameTr.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>{t('selectLanguageTitle')}</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  5 Dil / 5 Languages
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                {t('selectLanguageDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Main Supported Language Selection Cards */}
        <div className="p-4 bg-neutral-950/40 border-b border-neutral-800">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              {t('activeLanguage')}:
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SUPPORTED_LANGUAGES.map(item => {
              const isActive = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition transform active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white hover:border-neutral-500'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.flag}</span>
                  <span className="text-xs font-black">{item.nativeName}</span>
                  <span className="text-[10px] text-neutral-400">{item.name}</span>
                  {isActive && (
                    <span className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded-full">
                      <Check className="w-2.5 h-2.5" /> Aktif
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar for World Countries */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchCountry')}
              className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Alphabetical Countries List */}
        <div className="overflow-y-auto flex-1 divide-y divide-neutral-800/60 p-2 max-h-[260px]">
          {filteredCountries.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-sm">
              Eşleşen ülke bulunamadı. / No matching country found.
            </div>
          ) : (
            filteredCountries.map((item) => {
              const isSelected = country.code === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setCountry(item.code);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-white font-bold'
                      : 'hover:bg-neutral-800/60 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">
                          {language === 'tr' ? item.nameTr : item.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          [{item.code}]
                        </span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Check className="w-4 h-4" />
                      <span>{t('equipped')}</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{country.flag} {country.name} • {language.toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg transition active:scale-95 cursor-pointer"
          >
            {t('saveAndApply')}
          </button>
        </div>
      </div>
    </div>
  );
};
