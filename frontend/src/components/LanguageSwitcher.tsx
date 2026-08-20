import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAuth();

  const currentLang = language || i18n.language || 'mr';

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
  ];

  const handleSelect = (code: 'en' | 'mr' | 'hi') => {
    setLanguage(code);
  };

  return (
    <div className={`inline-flex items-center gap-1 p-1 rounded-full text-xs font-medium border shadow-sm transition-all ${
      variant === 'dark' 
        ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
        : 'bg-white/95 border-slate-200 text-slate-700'
    }`}>
      <Globe className="w-3.5 h-3.5 ml-1.5 text-emerald-600 shrink-0" />
      <div className="flex items-center gap-0.5">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code || currentLang.startsWith(lang.code);
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code as 'en' | 'mr' | 'hi')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm scale-105'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
