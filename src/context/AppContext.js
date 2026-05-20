import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

const DARK_COLORS = {
  background: '#050815',
  backgroundSecondary: '#0a0f1e',
  surface: 'rgba(255,255,255,0.05)',
  surfaceHover: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.08)',
  teal: '#00D4AA',
  blue: '#3B5BDB',
  purple: '#7C3AED',
  glowTeal: 'rgba(0,212,170,0.4)',
  glowBlue: 'rgba(59,91,219,0.4)',
  glowPurple: 'rgba(124,58,237,0.4)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.35)',
  white: '#FFFFFF',
  black: '#000000',
  success: '#22C55E',
  whatsapp: '#25D366',
  isDark: true,
  cardGradient: ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)'],
  overlayGradient: ['rgba(5,8,21,0.4)', 'rgba(5,8,21,0.7)', '#050815'],
  tabBarGradient: ['rgba(5,8,21,0)', 'rgba(5,8,21,0.97)'],
  inputBg: 'rgba(255,255,255,0.05)',
  statusBarStyle: 'light-content',
};

const LIGHT_COLORS = {
  background: '#F0F2F8',
  backgroundSecondary: '#E2E6F0',
  surface: 'rgba(0,0,0,0.04)',
  surfaceHover: 'rgba(0,0,0,0.07)',
  border: 'rgba(0,0,0,0.1)',
  teal: '#00B894',
  blue: '#3B5BDB',
  purple: '#7C3AED',
  glowTeal: 'rgba(0,184,148,0.25)',
  glowBlue: 'rgba(59,91,219,0.25)',
  glowPurple: 'rgba(124,58,237,0.25)',
  textPrimary: '#0D1117',
  textSecondary: 'rgba(13,17,23,0.65)',
  textMuted: 'rgba(13,17,23,0.40)',
  white: '#FFFFFF',
  black: '#000000',
  success: '#22C55E',
  whatsapp: '#25D366',
  isDark: false,
  cardGradient: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.65)'],
  overlayGradient: ['rgba(240,242,248,0.2)', 'rgba(240,242,248,0.75)', '#F0F2F8'],
  tabBarGradient: ['rgba(240,242,248,0)', 'rgba(240,242,248,0.97)'],
  inputBg: 'rgba(0,0,0,0.05)',
  statusBarStyle: 'dark-content',
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
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
