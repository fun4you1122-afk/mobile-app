import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView,
  Dimensions, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import AnimatedGauge from '../components/AnimatedGauge';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';
import InteractiveLineChart from '../components/InteractiveLineChart';
import InteractiveBarChart from '../components/InteractiveBarChart';
import Marquee from '../components/Marquee';
import Icon from '../components/Icons';
import GradientText from '../components/GradientText';
import NeuralBackground from '../components/NeuralBackground';
import { useTheme } from '../context/AppContext';

const { width } = Dimensions.get('window');

function TypewriterText({ text, style, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 55);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, []);
  return <Animated.Text style={[style, { opacity }]}>{displayed}</Animated.Text>;
}

function ServiceCard({ item, index, navigation }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    const phase = index * 400;
    Animated.loop(
      Animated.sequence([
        Animated.delay(phase),
        Animated.timing(floatY, { toValue: -10, duration: 1600, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
      width: 175,
      marginRight: 12,
    }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Services')}
        activeOpacity={0.88}
        style={[styles.serviceCard, { borderColor: item.color + '40' }]}
      >
        <LinearGradient
          colors={[item.color + '25', item.color + '08']}
          style={StyleSheet.absoluteFill}
          borderRadius={18}
        />
        <Animated.View style={{ transform: [{ translateY: floatY }], alignSelf: 'flex-start' }}>
          <Icon name={item.icon} size={36} color={item.color} strokeWidth={1.6} />
        </Animated.View>
        <Text style={[Typography.h4, { color: colors.textPrimary, marginTop: 14, marginBottom: 8 }]}>
          {item.title}
        </Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary, lineHeight: 18 }]}>
          {item.desc}
        </Text>
        <View style={[styles.serviceArrow, { backgroundColor: item.color + '25', borderColor: item.color + '50' }]}>
          <Icon name="arrowRight" size={14} color={item.color} strokeWidth={2} />
        </View>
        <LinearGradient
          colors={[item.color, 'transparent']}
          style={styles.cardAccentBottom}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

function WorkCard({ item, index, navigation }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 120),
      Animated.spring(anim, { toValue: 1, tension: 45, friction: 7, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2000 + index * 300, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.15, 0] });

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
      width: 200,
      marginRight: 12,
    }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Portfolio')}
        activeOpacity={0.85}
        style={[styles.workCard, { borderColor: item.color + '40' }]}
      >
        <LinearGradient
          colors={[item.color + '35', item.color + '10', 'transparent']}
          style={StyleSheet.absoluteFill}
          borderRadius={18}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 18, backgroundColor: '#fff', opacity: shimmerOpacity }]} />

        <View style={[styles.workIconBg, { backgroundColor: item.color + '30' }]}>
          <Icon name={item.icon} size={26} color={item.color} strokeWidth={1.7} />
        </View>
        <View style={[styles.workCatBadge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
          <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.cat}</Text>
        </View>
        <Text style={[Typography.h4, { color: colors.textPrimary, marginTop: 10, lineHeight: 20 }]}>
          {item.title}
        </Text>
        <LinearGradient
          colors={[item.color, 'transparent']}
          style={styles.cardAccentBottom}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors, t, isDark } = useTheme();
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(30)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const SERVICES = [
    { icon: 'globe', title: t('svcWebTitle'), desc: t('svcWebDesc'), color: colors.teal },
    { icon: 'lightbulb', title: t('svcItTitle'), desc: t('svcItDesc'), color: colors.blue },
    { icon: 'smartphone', title: t('svcMobileTitle'), desc: t('svcMobileDesc'), color: colors.purple },
    { icon: 'rocket', title: t('svcDigitalTitle'), desc: t('svcDigitalDesc'), color: colors.teal },
    { icon: 'palette', title: t('svcBrandTitle'), desc: t('svcBrandDesc'), color: colors.blue },
    { icon: 'chart', title: t('svcMarketingTitle'), desc: t('svcMarketingDesc'), color: colors.purple },
  ];

  const RECENT_WORK = [
    { title: t('work1Title'), cat: t('catWeb'), icon: 'globe', color: colors.teal },
    { title: t('work2Title'), cat: t('catMobile'), icon: 'cart', color: colors.blue },
    { title: t('work3Title'), cat: t('catBranding'), icon: 'palette', color: colors.purple },
    { title: t('work4Title'), cat: t('catConsulting'), icon: 'cloud', color: colors.teal },
    { title: t('work5Title'), cat: t('catWeb'), icon: 'building', color: colors.blue },
  ];

  const GAUGES = [
    { value: 93, maxValue: 100, label: t('gaugeSatisfaction'), color: colors.teal, unit: '%' },
    { value: 50, maxValue: 60, label: t('gaugeProjects'), color: colors.blue, unit: '+' },
    { value: 8, maxValue: 10, label: t('gaugeFollowing'), color: colors.purple, unit: 'K' },
    { value: 24, maxValue: 30, label: t('gaugeRoi'), color: colors.teal, unit: 'x' },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(heroY, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -12, duration: 2200, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const logoScale = scrollY.interpolate({ inputRange: [0, 200], outputRange: [1, 0.7], extrapolate: 'clamp' });
  const heroOpacityScroll = scrollY.interpolate({ inputRange: [0, 250], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="transparent" translucent />
      <VideoBackground source={require('../../assets/videos/home.mp4')} lightMode={!isDark} />
      <NeuralBackground height={460} opacity={isDark ? 0.55 : 0.35} />

      <ScreenWrapper style={{ flex: 1 }}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
        >
          {/* Hero with parallax */}
          <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroY }] }]}>
            <Animated.View style={{ transform: [{ translateY: logoFloat }, { scale: logoScale }], alignItems: 'center' }}>
              <View style={[styles.logoGlow, { shadowColor: colors.teal }]}>
                <Image source={require('../../assets/images/logo.png')} style={styles.heroLogo} resizeMode="contain" />
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: heroOpacityScroll, alignItems: 'center' }}>
              <GradientText style={styles.heroTitle}>{t('heroBrand')}</GradientText>
              <TypewriterText text={t('heroSlogan')} style={[styles.heroSubtitle, { color: colors.textSecondary }]} delay={900} />
              <Text style={[styles.tagline, { color: colors.teal }]}>{t('heroTagline')}</Text>

              <View style={styles.heroCTA}>
                <TouchableOpacity style={styles.ctaPrimary} onPress={() => navigation.navigate('Contact')} activeOpacity={0.85}>
                  <LinearGradient colors={['#00D4AA', '#3B5BDB', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                    <Text style={styles.ctaPrimaryText}>{t('getStarted')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.ctaSecondary, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => navigation.navigate('Portfolio')} activeOpacity={0.85}>
                  <Text style={[styles.ctaSecondaryText, { color: colors.textPrimary }]}>{t('viewAll')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Scrolling marquee ticker */}
          <View style={[styles.marqueeWrap, { borderColor: colors.border }]}>
            <Marquee text={t('marquee1')} color={colors.teal} speed={40} />
          </View>

          {/* Gauges — 4 in one row */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.teal }]}>{t('byTheNumbers')}</Text>
            <View style={[styles.gaugesRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {GAUGES.map((g, i) => <AnimatedGauge key={i} {...g} index={i} />)}
            </View>
          </View>

          {/* Horizontal scrolling services */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionLabel, { paddingHorizontal: 16, color: colors.teal }]}>{t('whatWeDo')}</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: 16, paddingHorizontal: 16 }]}>{t('ourServices')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
              decelerationRate="fast"
              snapToInterval={187}
              snapToAlignment="start"
            >
              {SERVICES.map((item, i) => <ServiceCard key={i} item={item} index={i} navigation={navigation} />)}
            </ScrollView>
          </View>

          {/* Horizontal scrolling recent work */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionLabel, { paddingHorizontal: 16, color: colors.teal }]}>{t('recentWorkLabel')}</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: 16, paddingHorizontal: 16 }]}>{t('recentWork')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
              decelerationRate="fast"
              snapToInterval={212}
              snapToAlignment="start"
            >
              {RECENT_WORK.map((item, i) => <WorkCard key={i} item={item} index={i} navigation={navigation} />)}
            </ScrollView>
          </View>

          {/* Second marquee */}
          <View style={[styles.marqueeWrap, { marginTop: 24, borderColor: colors.border }]}>
            <Marquee text={t('marquee2')} color={colors.purple} speed={35} />
          </View>

          {/* Interactive Charts */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.teal }]}>{t('growthPerf')}</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary, marginBottom: 6 }]}>{t('liveInsights')}</Text>
            <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginBottom: 16 }]}>
              {t('chartInstruction')}
            </Text>
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <InteractiveLineChart data={[8, 12, 10, 18, 22, 19, 28, 33, 31, 38, 44, 50]} label={t('chartLineLabel')} color={colors.teal} unit="clients" />
            </View>
            <View style={[styles.chartCard, { marginTop: 16, backgroundColor: colors.surface, borderColor: colors.border }]}>
              <InteractiveBarChart
                label={t('chartBarLabel')}
                data={[
                  { label: 'Web', value: 35, color: colors.teal },
                  { label: 'Mobile', value: 28, color: colors.blue },
                  { label: 'Consult', value: 20, color: colors.purple },
                  { label: 'Brand', value: 10, color: colors.teal },
                  { label: 'Mktg', value: 7, color: colors.blue },
                ]}
              />
            </View>
          </View>

          {/* CTA */}
          <View style={[styles.section, { marginBottom: 8 }]}>
            <GlassCard glowColor={colors.glowTeal} onPress={() => navigation.navigate('Contact')}>
              <View style={styles.ctaBanner}>
                <Icon name="chat" size={28} gradient={['#00D4AA', '#7C3AED']} strokeWidth={1.7} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[Typography.h4, { color: colors.textPrimary }]}>{t('ctaReadyTitle')}</Text>
                  <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 3 }]}>{t('ctaReadyDesc')}</Text>
                </View>
                <Icon name="arrowRight" size={20} color={colors.teal} strokeWidth={2} />
              </View>
            </GlassCard>
          </View>

          <View style={{ height: 120 }} />
        </Animated.ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 20 },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 20 },
  logoGlow: { shadowOpacity: 0.5, shadowRadius: 30, elevation: 15, marginBottom: 20 },
  heroLogo: { width: 300, height: 300 },
  heroTitle: { ...Typography.h1, letterSpacing: 10, textAlign: 'center', fontSize: 32 },
  heroSubtitle: { ...Typography.body, textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
  tagline: { ...Typography.label, marginTop: 10, letterSpacing: 4 },
  heroCTA: { flexDirection: 'row', gap: 12, marginTop: 24 },
  ctaPrimary: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  ctaPrimaryText: { ...Typography.button, color: '#fff' },
  ctaSecondary: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  ctaSecondaryText: { ...Typography.button },

  marqueeWrap: { paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, backgroundColor: 'rgba(0,212,170,0.04)' },

  section: { paddingHorizontal: 16, marginTop: 32 },
  sectionLabel: { ...Typography.label, marginBottom: 12 },

  gaugesRow: { flexDirection: 'row', justifyContent: 'space-between', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 8, borderWidth: 1 },

  serviceCard: { borderRadius: 18, borderWidth: 1, padding: 18, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)' },
  serviceArrow: { alignSelf: 'flex-start', marginTop: 14, width: 32, height: 32, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  workCard: { borderRadius: 18, borderWidth: 1, padding: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)', minHeight: 160 },
  workIconBg: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  workCatBadge: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },

  cardAccentBottom: { height: 2, borderRadius: 2, marginTop: 14 },
  cardAccent: { height: 2, borderRadius: 2, marginTop: 12 },
  chartCard: { borderRadius: 20, padding: 16, borderWidth: 1 },
  ctaBanner: { flexDirection: 'row', alignItems: 'center' },
});
