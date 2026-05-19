import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView,
  Dimensions, StatusBar, TouchableOpacity, Image, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme/colors';
import { Typography } from '../theme/typography';
import ParticleField from '../components/ParticleField';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import GlassCard from '../components/GlassCard';
import PulseRing from '../components/PulseRing';

const { width, height } = Dimensions.get('window');

const SERVICES = [
  { icon: '🌐', title: 'Web Development', desc: 'Stunning websites that drive real business results', color: Colors.teal },
  { icon: '💡', title: 'IT Consulting', desc: 'Strategic tech guidance to scale your business', color: Colors.blue },
  { icon: '📱', title: 'Mobile Apps', desc: 'iOS & Android apps built for growth', color: Colors.purple },
  { icon: '🚀', title: 'Digital Solutions', desc: 'End-to-end digital transformation from the UAE', color: Colors.teal },
];

const STATS = [
  { value: '93%', label: 'Client Satisfaction' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '8K+', label: 'Social Following' },
  { value: '2.4x', label: 'Avg. ROI' },
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

function StatItem({ item, index }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(600 + index * 120),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statItem, { transform: [{ scale }] }]}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(30)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hero entrance
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(heroY, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    // Floating logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const headerScale = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#050815', '#080d1c']} style={StyleSheet.absoluteFill} />
      <AnimatedGradientBackground />
      <ParticleField />

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroY }, { scale: headerScale }] }]}>
          <Animated.View style={{ transform: [{ translateY: logoFloat }], alignItems: 'center' }}>
            <View style={styles.logoGlow}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.heroLogo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <TypewriterText
            text="WETHINK"
            style={styles.heroTitle}
            delay={200}
          />
          <TypewriterText
            text="We think big. You achieve bigger."
            style={styles.heroSubtitle}
            delay={1200}
          />

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

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((item, i) => <StatItem key={i} item={item} index={i} />)}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHAT WE DO</Text>
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 20 }]}>
            Our Services
          </Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((item, i) => <ServiceCard key={i} item={item} index={i} />)}
          </View>
        </View>

        {/* Contact CTA */}
        <View style={styles.section}>
          <GlassCard glowColor={Colors.glowTeal} onPress={() => navigation.navigate('Contact')}>
            <View style={styles.ctaBanner}>
              <PulseRing color={Colors.glowTeal} size={56}>
                <Text style={{ fontSize: 24 }}>💬</Text>
              </PulseRing>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Ready to grow?</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 4 }]}>
                  Let's build your digital future together
                </Text>
              </View>
              <Text style={{ color: Colors.teal, fontSize: 20 }}>→</Text>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <LinearGradient
          colors={['rgba(5,8,21,0)', 'rgba(5,8,21,0.98)']}
          style={StyleSheet.absoluteFill}
        />
        {[
          { icon: '🏠', label: 'Home', screen: 'Home' },
          { icon: '⚡', label: 'Services', screen: 'Services' },
          { icon: '🎨', label: 'Portfolio', screen: 'Portfolio' },
          { icon: '📖', label: 'About', screen: 'About' },
          { icon: '📞', label: 'Contact', screen: 'Contact' },
        ].map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            <Text style={[Typography.label, { color: Colors.textMuted, marginTop: 4, fontSize: 9 }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingTop: 60 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoGlow: {
    shadowColor: Colors.teal,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 24,
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
  heroCTA: { flexDirection: 'row', gap: 12, marginTop: 28 },
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: { alignItems: 'center' },
  statValue: { ...Typography.h2, color: Colors.teal, fontSize: 24 },
  statLabel: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginTop: 32 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardAccent: { height: 2, borderRadius: 2, marginTop: 12 },
  ctaBanner: { flexDirection: 'row', alignItems: 'center' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 28,
    paddingTop: 40,
  },
  navItem: { alignItems: 'center' },
});
