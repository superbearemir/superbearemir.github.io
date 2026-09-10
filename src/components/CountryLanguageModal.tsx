import React, { useState, useMemo } from 'react';
import { Globe, Search, Check, X, ArrowRight, Languages } from 'lucide-react';
import { COUNTRIES, CountryInfo } from '../i18n/countriesData';
import { useLanguage } from '../i18n/LanguageContext';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {t('selectLanguageTitle')}
              </h2>
              <p className="text-xs text-neutral-400">
                {t('allCountriesCount')} ({COUNTRIES.length} {language === 'tr' ? 'Ülke' : 'Countries'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Quick Switchers */}
        <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              {t('activeLanguage')}:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('tr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                language === 'tr'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span>🇹🇷</span>
              <span>Türkçe</span>
              {language === 'tr' && <Check className="w-4 h-4 ml-1" />}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                language === 'en'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span>🇬🇧 / 🇺🇸</span>
              <span>English</span>
              {language === 'en' && <Check className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/40">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Alphabetical Countries List */}
        <div className="overflow-y-auto flex-1 divide-y divide-neutral-800/60 p-2">
          {filteredCountries.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-sm">
              Eşleşen ülke bulunamadı. / No country found matching search.
            </div>
          ) : (
            filteredCountries.map((item, index) => {
              const isSelected = country.code === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setCountry(item.code);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                      : 'hover:bg-neutral-800/60 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {language === 'tr' ? item.nameTr : item.name}
                        </span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {language === 'tr' ? item.name : item.nameTr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        {t('activeLanguage')}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-500 group-hover:text-neutral-300">
                        {item.defaultLang === 'tr' ? 'Türkçe' : 'English'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <span>{country.flag}</span>
            <span>
              {language === 'tr' ? country.nameTr : country.name} &bull;{' '}
              {language === 'tr' ? 'Türkçe Aktif' : 'English Active'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
          >
            {t('saveAndApply')}
          </button>
        </div>
      </div>
    </div>
  );
};
