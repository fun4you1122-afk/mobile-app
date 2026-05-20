import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../theme/typography';
import { useTheme } from '../context/AppContext';

function ToolCard({ item, index, navigation }) {
  const { colors, t } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 130),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.cardWrap, { opacity: anim, transform: [{ translateY }] }]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigation.navigate('WebView', { url: item.url, title: item.name, color: item.color })}
        style={styles.cardTouch}
      >
        <View style={[styles.card, { borderColor: item.color + '35', backgroundColor: colors.surface }]}>
          {/* Top accent line */}
          <LinearGradient
            colors={[item.color, item.color + '00']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.topAccent}
          />

          <View style={styles.cardRow}>
            {/* Icon bubble */}
            <LinearGradient
              colors={[item.color + '30', item.color + '10']}
              style={[styles.iconBubble, { shadowColor: item.color }]}
            >
              <Text style={{ fontSize: 32 }}>{item.icon}</Text>
            </LinearGradient>

            <View style={styles.cardMeta}>
              <View style={[styles.badge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
                <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.badge}</Text>
              </View>
              <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: 6 }]}>{item.name}</Text>
              <Text style={[Typography.label, { color: item.color, marginTop: 2 }]}>{item.tagline}</Text>
            </View>
          </View>

          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 14, lineHeight: 24 }]}>
            {item.desc}
          </Text>

          {/* CTA row */}
          <View style={[styles.launchRow, { borderTopColor: item.color + '25' }]}>
            <Text style={[Typography.label, { color: item.color }]}>{t('open')}</Text>
            <LinearGradient
              colors={[item.color + '30', item.color + '10']}
              style={styles.launchArrow}
            >
              <Text style={{ color: item.color, fontSize: 16 }}>→</Text>
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ToolsScreen({ navigation }) {
  const { colors, t, isDark } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  const TOOLS = [
    { icon: '🤖', name: t('tool1Name'), tagline: t('tool1Tagline'), desc: t('tool1Desc'), color: colors.teal, glow: colors.glowTeal, url: 'https://deepai.org/chat', badge: t('tool1Badge') },
    { icon: '💡', name: t('tool2Name'), tagline: t('tool2Tagline'), desc: t('tool2Desc'), color: colors.purple, glow: colors.glowPurple, url: 'https://you.com/search?fromSearchBar=true&tbm=youchat', badge: t('tool2Badge') },
    { icon: '📊', name: t('tool3Name'), tagline: t('tool3Tagline'), desc: t('tool3Desc'), color: colors.blue, glow: colors.glowBlue, url: 'https://app.hubspot.com/login', badge: t('tool3Badge') },
    { icon: '📋', name: t('tool4Name'), tagline: t('tool4Tagline'), desc: t('tool4Desc'), color: colors.teal, glow: colors.glowTeal, url: 'https://www.refrens.com/en-ae/free-online-quotation-generator', badge: t('tool4Badge') },
  ];

  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }).start();
  }, []);

  const bgColors = isDark
    ? ['#050815', '#080d1c', '#0a0f24']
    : [colors.background, colors.backgroundSecondary, colors.background];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="transparent" translucent />
      <LinearGradient
        colors={bgColors}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <Text style={[styles.sectionLabel, { color: colors.teal }]}>{t('poweredBy')}</Text>
          <Text style={[Typography.h1, { color: colors.textPrimary }]}>{t('toolsTitle')}</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8, lineHeight: 26 }]}>
            {t('toolsSub')}
          </Text>
        </Animated.View>

        {TOOLS.map((item, i) => (
          <ToolCard key={i} item={item} index={i} navigation={navigation} />
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 28 },
  sectionLabel: { ...Typography.label, marginBottom: 8 },
  cardWrap: { marginBottom: 16 },
  cardTouch: { borderRadius: 20, overflow: 'hidden' },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
  },
  topAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconBubble: {
    width: 72, height: 72, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  cardMeta: { flex: 1, marginLeft: 16, paddingTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  launchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 16, paddingTop: 14, borderTopWidth: 1,
  },
  launchArrow: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
});
