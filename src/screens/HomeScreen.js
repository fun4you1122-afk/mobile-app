import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView,
  Dimensions, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import AnimatedGauge from '../components/AnimatedGauge';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';
import InteractiveLineChart from '../components/InteractiveLineChart';
import InteractiveBarChart from '../components/InteractiveBarChart';
import Marquee from '../components/Marquee';

const { width } = Dimensions.get('window');

const SERVICES = [
  { icon: '🌐', title: 'Web Development', desc: 'Stunning websites that convert visitors into customers', color: Colors.teal },
  { icon: '💡', title: 'IT Consulting', desc: 'Strategic tech guidance to scale your UAE business', color: Colors.blue },
  { icon: '📱', title: 'Mobile Apps', desc: 'iOS & Android apps built for growth and retention', color: Colors.purple },
  { icon: '🚀', title: 'Digital Solutions', desc: 'End-to-end digital transformation from the UAE', color: Colors.teal },
  { icon: '🎨', title: 'Brand Identity', desc: 'Distinctive brands that win in the digital age', color: Colors.blue },
  { icon: '📊', title: 'Digital Marketing', desc: 'Data-driven campaigns tailored for the UAE market', color: Colors.purple },
];

const RECENT_WORK = [
  { title: 'Digital Presence Platform', cat: 'WEB', icon: '🌐', color: Colors.teal },
  { title: 'E-Commerce Mobile App', cat: 'MOBILE', icon: '📱', color: Colors.blue },
  { title: 'Corporate Rebrand', cat: 'BRANDING', icon: '🎨', color: Colors.purple },
  { title: 'Cloud Migration', cat: 'CONSULTING', icon: '☁️', color: Colors.teal },
  { title: 'Real Estate Portal', cat: 'WEB', icon: '🏢', color: Colors.blue },
];

const GAUGES = [
  { value: 93, maxValue: 100, label: 'Satisfaction', color: Colors.teal, unit: '%' },
  { value: 50, maxValue: 60, label: 'Projects', color: Colors.blue, unit: '+' },
  { value: 8, maxValue: 10, label: 'Following', color: Colors.purple, unit: 'K' },
  { value: 24, maxValue: 30, label: 'Avg ROI', color: Colors.teal, unit: 'x' },
];

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
  const anim = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    // Icon float loop (different phase per card)
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
        <Animated.Text style={{ fontSize: 38, transform: [{ translateY: floatY }] }}>
          {item.icon}
        </Animated.Text>
        <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: 14, marginBottom: 8 }]}>
          {item.title}
        </Text>
        <Text style={[Typography.bodySmall, { color: Colors.textSecondary, lineHeight: 18 }]}>
          {item.desc}
        </Text>
        <View style={[styles.serviceArrow, { backgroundColor: item.color + '25', borderColor: item.color + '50' }]}>
          <Text style={{ color: item.color, fontSize: 14 }}>→</Text>
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
        {/* Shimmer overlay */}
        <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 18, backgroundColor: '#fff', opacity: shimmerOpacity }]} />

        <View style={[styles.workIconBg, { backgroundColor: item.color + '30' }]}>
          <Text style={{ fontSize: 28 }}>{item.icon}</Text>
        </View>
        <View style={[styles.workCatBadge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
          <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.cat}</Text>
        </View>
        <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: 10, lineHeight: 20 }]}>
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
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(30)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // Parallax scale for logo based on scroll
  const logoScale = scrollY.interpolate({ inputRange: [0, 200], outputRange: [1, 0.7], extrapolate: 'clamp' });
  const heroOpacityScroll = scrollY.interpolate({ inputRange: [0, 250], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <VideoBackground source={require('../../assets/videos/home.mp4')} />

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
              <View style={styles.logoGlow}>
                <Image source={require('../../assets/images/logo.png')} style={styles.heroLogo} resizeMode="contain" />
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: heroOpacityScroll, alignItems: 'center' }}>
              <TypewriterText text="WETHINK" style={styles.heroTitle} delay={200} />
              <TypewriterText text="We think big. You achieve bigger." style={styles.heroSubtitle} delay={1200} />
              <Text style={styles.tagline}>THINK · PLAN · GROW</Text>

              <View style={styles.heroCTA}>
                <TouchableOpacity style={styles.ctaPrimary} onPress={() => navigation.navigate('Contact')} activeOpacity={0.85}>
                  <LinearGradient colors={['#00D4AA', '#3B5BDB', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                    <Text style={styles.ctaPrimaryText}>Get Started</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaSecondary} onPress={() => navigation.navigate('Portfolio')} activeOpacity={0.85}>
                  <Text style={styles.ctaSecondaryText}>Our Work</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Scrolling marquee ticker */}
          <View style={styles.marqueeWrap}>
            <Marquee text="WEB DEVELOPMENT · MOBILE APPS · IT CONSULTING · DIGITAL SOLUTIONS · BRAND IDENTITY · UAE BASED" color={Colors.teal} speed={40} />
          </View>

          {/* Gauges — 4 in one row */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>BY THE NUMBERS</Text>
            <View style={styles.gaugesRow}>
              {GAUGES.map((g, i) => <AnimatedGauge key={i} {...g} index={i} />)}
            </View>
          </View>

          {/* Horizontal scrolling services */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionLabel, { paddingHorizontal: 16 }]}>WHAT WE DO</Text>
            <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 16, paddingHorizontal: 16 }]}>Our Services</Text>
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
            <Text style={[styles.sectionLabel, { paddingHorizontal: 16 }]}>RECENT WORK</Text>
            <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 16, paddingHorizontal: 16 }]}>Featured Projects</Text>
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

          {/* Second marquee — reversed direction via different content */}
          <View style={[styles.marqueeWrap, { marginTop: 24 }]}>
            <Marquee text="CLIENT SATISFACTION 93% · 50+ PROJECTS DELIVERED · 8K SOCIAL FOLLOWING · UAE FOCUS 100%" color={Colors.purple} speed={35} />
          </View>

          {/* Interactive Charts */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GROWTH & PERFORMANCE</Text>
            <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 6 }]}>Live Insights</Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginBottom: 16 }]}>
              Drag the line chart · Tap bars to reveal data
            </Text>
            <View style={styles.chartCard}>
              <InteractiveLineChart data={[8, 12, 10, 18, 22, 19, 28, 33, 31, 38, 44, 50]} label="Client Acquisitions — 2024" color={Colors.teal} unit="clients" />
            </View>
            <View style={[styles.chartCard, { marginTop: 16 }]}>
              <InteractiveBarChart
                label="Service Revenue Mix"
                data={[
                  { label: 'Web', value: 35, color: Colors.teal },
                  { label: 'Mobile', value: 28, color: Colors.blue },
                  { label: 'Consult', value: 20, color: Colors.purple },
                  { label: 'Brand', value: 10, color: Colors.teal },
                  { label: 'Mktg', value: 7, color: Colors.blue },
                ]}
              />
            </View>
          </View>

          {/* CTA */}
          <View style={[styles.section, { marginBottom: 8 }]}>
            <GlassCard glowColor={Colors.glowTeal} onPress={() => navigation.navigate('Contact')}>
              <View style={styles.ctaBanner}>
                <Text style={{ fontSize: 28 }}>💬</Text>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Ready to grow?</Text>
                  <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 3 }]}>Let's build your digital future together</Text>
                </View>
                <Text style={{ color: Colors.teal, fontSize: 20 }}>→</Text>
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
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingTop: 60, paddingBottom: 20 },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 20 },
  logoGlow: { shadowColor: Colors.teal, shadowOpacity: 0.5, shadowRadius: 30, elevation: 15, marginBottom: 20 },
  heroLogo: { width: 300, height: 300 },
  heroTitle: { ...Typography.h1, color: Colors.textPrimary, letterSpacing: 10, textAlign: 'center', fontSize: 32 },
  heroSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
  tagline: { ...Typography.label, color: Colors.teal, marginTop: 10, letterSpacing: 4 },
  heroCTA: { flexDirection: 'row', gap: 12, marginTop: 24 },
  ctaPrimary: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  ctaPrimaryText: { ...Typography.button, color: '#fff' },
  ctaSecondary: { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, backgroundColor: Colors.surface },
  ctaSecondaryText: { ...Typography.button, color: Colors.textPrimary },

  marqueeWrap: { paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border, backgroundColor: 'rgba(0,212,170,0.04)' },

  section: { paddingHorizontal: 16, marginTop: 32 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 12 },

  gaugesRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 8, borderWidth: 1, borderColor: Colors.border },

  serviceCard: { borderRadius: 18, borderWidth: 1, padding: 18, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)' },
  serviceArrow: { alignSelf: 'flex-start', marginTop: 14, width: 32, height: 32, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  workCard: { borderRadius: 18, borderWidth: 1, padding: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)', minHeight: 160 },
  workIconBg: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  workCatBadge: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },

  cardAccentBottom: { height: 2, borderRadius: 2, marginTop: 14 },
  cardAccent: { height: 2, borderRadius: 2, marginTop: 12 },
  chartCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border },
  ctaBanner: { flexDirection: 'row', alignItems: 'center' },
});
