import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

const DARK_COLORS = {
  background: '#0B0918',
  backgroundSecondary: '#141026',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.09)',
  border: 'rgba(255,255,255,0.08)',
  teal: '#22D3EE',
  blue: '#818CF8',
  purple: '#A78BFA',
  glowTeal: 'rgba(34,211,238,0.4)',
  glowBlue: 'rgba(129,140,248,0.4)',
  glowPurple: 'rgba(167,139,250,0.4)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.38)',
  white: '#FFFFFF',
  black: '#000000',
  success: '#34D399',
  whatsapp: '#25D366',
  isDark: true,
  // Pastel design-system tokens (dark variants)
  cardBg: '#181227',
  cardShadow: 'rgba(0,0,0,0.5)',
  accentPurple: '#A78BFA',
  accentCyan: '#22D3EE',
  accentPink: '#F472B6',
  accentAmber: '#FBBF24',
  chipPurple: 'rgba(167,139,250,0.16)',
  chipCyan: 'rgba(34,211,238,0.14)',
  chipPink: 'rgba(244,114,182,0.15)',
  chipAmber: 'rgba(251,191,36,0.14)',
  pillBg: '#FFFFFF',
  pillText: '#0B0918',
  heroCardBg: '#1C1533',
  cardGradient: ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)'],
  overlayGradient: ['rgba(11,9,24,0.4)', 'rgba(11,9,24,0.75)', '#0B0918'],
  tabBarGradient: ['rgba(11,9,24,0)', 'rgba(11,9,24,0.97)'],
  inputBg: 'rgba(255,255,255,0.06)',
  statusBarStyle: 'light-content',
};

const LIGHT_COLORS = {
  background: '#F6F1FB',
  backgroundSecondary: '#EFE7F8',
  surface: '#FFFFFF',
  surfaceHover: '#F4F0FA',
  border: 'rgba(17,24,39,0.06)',
  teal: '#06B6D4',
  blue: '#6366F1',
  purple: '#8B5CF6',
  glowTeal: 'rgba(6,182,212,0.22)',
  glowBlue: 'rgba(99,102,241,0.22)',
  glowPurple: 'rgba(139,92,246,0.22)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
  black: '#000000',
  success: '#22C55E',
  whatsapp: '#25D366',
  isDark: false,
  // Pastel design-system tokens
  cardBg: '#FFFFFF',
  cardShadow: 'rgba(139,92,246,0.16)',
  accentPurple: '#8B5CF6',
  accentCyan: '#06B6D4',
  accentPink: '#EC4899',
  accentAmber: '#F59E0B',
  chipPurple: '#EDE9FE',
  chipCyan: '#CFFAFE',
  chipPink: '#FCE7F3',
  chipAmber: '#FEF3C7',
  pillBg: '#111827',
  pillText: '#FFFFFF',
  heroCardBg: '#FFFFFF',
  cardGradient: ['#FFFFFF', '#FFFFFF'],
  overlayGradient: ['rgba(246,241,251,0.35)', 'rgba(246,241,251,0.8)', '#F6F1FB'],
  tabBarGradient: ['rgba(246,241,251,0)', 'rgba(246,241,251,0.97)'],
  inputBg: '#F4F0FA',
  statusBarStyle: 'dark-content',
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Pastel light theme is the flagship look — default unless the user opted into dark.
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguageState] = useState('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(['theme', 'language']).then(([themeEntry, langEntry]) => {
      if (themeEntry[1]) setIsDark(themeEntry[1] === 'dark');
      if (langEntry[1]) {
        setLanguageState(langEntry[1]);
        I18nManager.forceRTL(langEntry[1] === 'ar');
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    AsyncStorage.setItem('language', lang);
    I18nManager.forceRTL(lang === 'ar');
  }, []);

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const t = (key) => translations[language]?.[key] ?? translations.en[key] ?? key;
  const isRTL = language === 'ar';

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{ isDark, toggleTheme, colors, language, setLanguage, t, isRTL }}>
      {children}
    </AppContext.Provider>
  );
}

export const useTheme = () => useContext(AppContext);
