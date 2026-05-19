import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView,
  Dimensions, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import ParticleField from '../components/ParticleField';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import GlassCard from '../components/GlassCard';
import AnimatedGauge from '../components/AnimatedGauge';

const { width, height } = Dimensions.get('window');

// Free futuristic tech video (streamed — no APK size impact)
const VIDEO_URI = 'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_25fps.mp4';

const SERVICES = [
  { icon: '🌐', title: 'Web Development', desc: 'Stunning websites that drive real business results', color: Colors.teal },
  { icon: '💡', title: 'IT Consulting', desc: 'Strategic tech guidance to scale your business', color: Colors.blue },
  { icon: '📱', title: 'Mobile Apps', desc: 'iOS & Android apps built for growth', color: Colors.purple },
  { icon: '🚀', title: 'Digital Solutions', desc: 'End-to-end digital transformation from the UAE', color: Colors.teal },
];

const GAUGES = [
  { value: 93, maxValue: 100, label: 'Client Satisfaction', color: Colors.teal, unit: '%' },
  { value: 50, maxValue: 60, label: 'Projects Delivered', color: Colors.blue, unit: '+' },
  { value: 8, maxValue: 10, label: 'Social Following (K)', color: Colors.purple, unit: 'K' },
  { value: 24, maxValue: 30, label: 'Average ROI', color: Colors.teal, unit: 'x' },
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

function ServiceCard({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(index % 2 === 0 ? -60 : 60)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400 + index * 150),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateX }, { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
      width: (width - 48) / 2,
      marginBottom: 12,
    }}>
      <GlassCard glowColor={item.color + '80'}>
        <Text style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</Text>
        <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 6 }]}>{item.title}</Text>
        <Text style={[Typography.bodySmall, { color: Colors.textSecondary }]}>{item.desc}</Text>
        <LinearGradient
          colors={[item.color, 'transparent']}
          style={styles.cardAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </GlassCard>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(30)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(heroY, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Video background */}
      <Video
        ref={videoRef}
        source={{ uri: VIDEO_URI }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />

      {/* Dark overlay over video */}
      <LinearGradient
        colors={['rgba(5,8,21,0.7)', 'rgba(5,8,21,0.85)', '#050815']}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedGradientBackground />
      <ParticleField />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, {
          opacity: heroOpacity,
          transform: [{ translateY: heroY }],
        }]}>
          <Animated.View style={{ transform: [{ translateY: logoFloat }], alignItems: 'center' }}>
            <View style={styles.logoGlow}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.heroLogo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <TypewriterText text="WETHINK" style={styles.heroTitle} delay={200} />
          <TypewriterText text="We think big. You achieve bigger." style={styles.heroSubtitle} delay={1200} />

          <Text style={styles.tagline}>THINK · PLAN · GROW</Text>

          <View style={styles.heroCTA}>
            <TouchableOpacity
              style={styles.ctaPrimary}
              onPress={() => navigation.navigate('Contact')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#00D4AA', '#3B5BDB', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaPrimaryText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ctaSecondary}
              onPress={() => navigation.navigate('Portfolio')}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaSecondaryText}>Our Work</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Animated Gauges */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BY THE NUMBERS</Text>
          <View style={styles.gaugesGrid}>
            {GAUGES.map((g, i) => (
              <AnimatedGauge key={i} {...g} index={i} />
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHAT WE DO</Text>
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 16 }]}>
            Our Services
          </Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((item, i) => <ServiceCard key={i} item={item} index={i} />)}
          </View>
        </View>

        {/* Contact CTA */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <GlassCard glowColor={Colors.glowTeal} onPress={() => navigation.navigate('Contact')}>
            <View style={styles.ctaBanner}>
              <Text style={{ fontSize: 28 }}>💬</Text>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Ready to grow?</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 3 }]}>
                  Let's build your digital future together
                </Text>
              </View>
              <Text style={{ color: Colors.teal, fontSize: 20 }}>→</Text>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 90 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  video: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: height * 0.55,
  },
  scrollContent: { paddingTop: 60 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 28,
  },
  logoGlow: {
    shadowColor: Colors.teal,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 20,
  },
  heroLogo: { width: 100, height: 100 },
  heroTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    letterSpacing: 10,
    textAlign: 'center',
    fontSize: 32,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  tagline: {
    ...Typography.label,
    color: Colors.teal,
    marginTop: 10,
    letterSpacing: 4,
  },
  heroCTA: { flexDirection: 'row', gap: 12, marginTop: 24 },
  ctaPrimary: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  ctaPrimaryText: { ...Typography.button, color: Colors.white },
  ctaSecondary: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
  },
  ctaSecondaryText: { ...Typography.button, color: Colors.textPrimary },
  section: { paddingHorizontal: 16, marginTop: 28 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 12 },
  gaugesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardAccent: { height: 2, borderRadius: 2, marginTop: 12 },
  ctaBanner: { flexDirection: 'row', alignItems: 'center' },
});
