import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors, language, setLanguage, t, isRTL } = useTheme();

  const handleLanguageChange = (lang) => {
    if (lang === language) return;
    setLanguage(lang);
    Alert.alert(
      lang === 'ar' ? 'تغيير اللغة' : 'Language Changed',
      t('restartNote'),
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="transparent" translucent />

      {/* Header gradient */}
      <LinearGradient
        colors={['#00D4AA22', '#3B5BDB22', colors.background]}
        style={styles.headerGrad}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      />

      <ScreenWrapper style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { direction: isRTL ? 'rtl' : 'ltr' }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={[styles.titleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={{ fontSize: 32 }}>⚙️</Text>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                marginLeft: isRTL ? 0 : 12,
                marginRight: isRTL ? 12 : 0,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
              {t('settingsTitle')}
            </Text>
          </View>

          {/* Appearance Section */}
          <Text style={[styles.sectionHeader, { color: colors.teal, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('appearance')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.settingLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={{ fontSize: 22, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
                  {isDark ? '🌙' : '☀️'}
                </Text>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                    {isDark ? t('darkMode') : t('lightMode')}
                  </Text>
                  <Text style={[styles.settingDesc, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                    {isDark ? 'Switch to light' : 'Switch to dark'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E2E6F0', true: '#00D4AA55' }}
                thumbColor={isDark ? '#00D4AA' : '#94A3B8'}
                ios_backgroundColor="#3E3E3E"
              />
            </View>
          </View>

          {/* Language Section */}
          <Text style={[styles.sectionHeader, { color: colors.teal, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('language')}
          </Text>
          <View style={[styles.langRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {[
              { code: 'en', label: t('english'), flag: '🇬🇧' },
              { code: 'ar', label: t('arabic'), flag: '🇦🇪' },
            ].map((lang) => {
              const isSelected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLanguageChange(lang.code)}
                  activeOpacity={0.8}
                  style={[
                    styles.langCard,
                    {
                      borderColor: isSelected ? colors.teal : colors.border,
                      backgroundColor: isSelected ? colors.teal + '18' : colors.surface,
                      flex: 1,
                      marginHorizontal: 4,
                    },
                  ]}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={['#00D4AA22', '#3B5BDB22']}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>{lang.flag}</Text>
                  <Text style={[styles.langLabel, { color: isSelected ? colors.teal : colors.textPrimary }]}>
                    {lang.label}
                  </Text>
                  {isSelected && <View style={[styles.selectedDot, { backgroundColor: colors.teal }]} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Language note */}
          <Text style={[styles.noteText, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {'ℹ️'} {t('restartNote')}
          </Text>

          {/* App Info */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 24, alignItems: 'center' }]}>
            <LinearGradient
              colors={['#00D4AA', '#3B5BDB', '#7C3AED']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.brandBar}
            />
            <Text style={{ fontSize: 32, marginTop: 16 }}>🇦🇪</Text>
            <Text style={[styles.appName, { color: colors.textPrimary }]}>WeThink</Text>
            <Text style={[styles.appVersion, { color: colors.textMuted }]}>Version 1.0.0</Text>
            <Text style={[styles.appTagline, { color: colors.textSecondary }]}>IT Consulting & Digital Solutions</Text>
            <Text style={[styles.appLocation, { color: colors.textMuted }]}>📍 Abu Dhabi, UAE</Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
  content: { paddingHorizontal: 16, paddingTop: 70 },
  titleRow: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  sectionHeader: {
    fontSize: 11, fontWeight: '700', letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 10, marginTop: 8,
  },
  card: {
    borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 12, overflow: 'hidden',
  },
  settingRow: { alignItems: 'center', justifyContent: 'space-between' },
  settingLeft: { alignItems: 'center', flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  langRow: { marginBottom: 8 },
  langCard: {
    borderRadius: 16, borderWidth: 1.5, padding: 20, alignItems: 'center', overflow: 'hidden',
  },
  langLabel: { fontSize: 15, fontWeight: '700' },
  selectedDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  noteText: { fontSize: 11, marginTop: 4, marginBottom: 8, marginHorizontal: 4 },
  brandBar: { height: 4, width: '100%', borderRadius: 2, marginBottom: 4 },
  appName: { fontSize: 22, fontWeight: '800', marginTop: 6, letterSpacing: -0.5 },
  appVersion: { fontSize: 12, marginTop: 4 },
  appTagline: { fontSize: 13, marginTop: 8, textAlign: 'center' },
  appLocation: { fontSize: 12, marginTop: 6, marginBottom: 8 },
});
