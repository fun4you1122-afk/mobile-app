import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icons';
import { DecorField } from '../components/Doodles';

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
        colors={['#8B5CF622', '#06B6D422', colors.background]}
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
            <Icon name="settings" size={32} gradient={['#8B5CF6', '#EC4899']} strokeWidth={1.7} />
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
                <View style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
                  {isDark
                    ? <Icon name="moon" size={22} color={colors.purple} strokeWidth={1.8} />
                    : <Icon name="sun" size={22} color="#F59E0B" strokeWidth={1.8} />}
                </View>
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
                trackColor={{ false: '#E2E6F0', true: '#8B5CF655' }}
                thumbColor={isDark ? '#8B5CF6' : '#94A3B8'}
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
                      borderColor: isSelected ? colors.accentPurple : colors.border,
                      backgroundColor: isSelected ? colors.accentPurple + '18' : colors.surface,
                      flex: 1,
                      marginHorizontal: 4,
                    },
                  ]}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={['#8B5CF622', '#6366F122']}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>{lang.flag}</Text>
                  <Text style={[styles.langLabel, { color: isSelected ? colors.accentPurple : colors.textPrimary }]}>
                    {lang.label}
                  </Text>
                  {isSelected && <View style={[styles.selectedDot, { backgroundColor: colors.accentPurple }]} />}
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
              colors={['#8B5CF6', '#6366F1', '#EC4899']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.brandBar}
            />
            <DecorField items={[
              { name: 'sparkle', x: 14, y: 16, size: 18, color: colors.accentAmber, rotate: 8 },
              { name: 'ring', x: '88%', y: 18, size: 24, color: colors.accentCyan, opacity: 0.75 },
              { name: 'squiggle', x: 10, y: '76%', size: 24, color: colors.accentPurple, rotate: -12, opacity: 0.7 },
              { name: 'sparkle', x: '90%', y: '70%', size: 13, color: colors.accentPink, rotate: -10 },
            ]} />
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
