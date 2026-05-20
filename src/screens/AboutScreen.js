import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, Dimensions, StatusBar, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';

const { width } = Dimensions.get('window');

const VALUES = [
  { icon: '🎯', title: 'Results First', desc: 'Every decision we make is tied to measurable outcomes for your business.', color: Colors.teal },
  { icon: '🤝', title: 'True Partnership', desc: 'We become part of your team, not just a vendor you invoice.', color: Colors.blue },
  { icon: '🔬', title: 'Innovation Always', desc: 'We stay ahead of technology so your business stays ahead of competition.', color: Colors.purple },
  { icon: '🇦🇪', title: 'UAE Focused', desc: 'Deep understanding of the local market, culture, and business landscape.', color: Colors.teal },
];

function TimelineItem({ item, index, isLast }) {
  const anim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300 + index * 150),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.timelineItem, { opacity: anim, transform: [{ translateX }] }]}>
      {/* Left: dot + line */}
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: item.color, shadowColor: item.color }]}>
          <Text style={{ fontSize: 14 }}>{item.icon}</Text>
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: item.color + '40' }]} />}
      </View>

      {/* Right: content */}
      <View style={styles.timelineRight}>
        <View style={[styles.timelineCard, { borderLeftColor: item.color + '60' }]}>
          <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 6 }]}>{item.title}</Text>
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, lineHeight: 20 }]}>{item.desc}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function AboutScreen() {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(logoAnim, { toValue: 1, tension: 40, friction: 6, useNativeDriver: true }),
      Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -8, duration: 2200, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <VideoBackground source={require('../../assets/videos/about.mp4')} />

      <ScreenWrapper style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Hero */}
        <Animated.View style={[styles.heroSection, {
          opacity: logoAnim,
          transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
        }]}>
          <Animated.View style={{ transform: [{ translateY: logoFloat }], alignItems: 'center' }}>
            <View style={styles.logoGlow}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <Text style={styles.brandName}>WETHINK</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }]}>
            We think big. You achieve bigger.
          </Text>

          <LinearGradient
            colors={['#00D4AA', '#3B5BDB', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />
        </Animated.View>

        {/* Story */}
        <Animated.View style={[styles.section, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }]}>
          <Text style={styles.sectionLabel}>OUR STORY</Text>
          <GlassCard glowColor={Colors.glowTeal}>
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 12 }]}>
              Building Future-Ready Businesses from the UAE
            </Text>
            <Text style={[Typography.body, { color: Colors.textSecondary, lineHeight: 26 }]}>
              WeThink was founded with a single belief: that businesses in the UAE deserve world-class digital
              experiences built by people who understand the local market.
            </Text>
            <Text style={[Typography.body, { color: Colors.textSecondary, lineHeight: 26, marginTop: 12 }]}>
              We're not just developers or consultants — we're digital architects who turn ambitious ideas
              into scalable, revenue-generating digital products. Every client we partner with gets our
              full commitment: strategy, design, development, and growth.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Values - Vertical Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OUR VALUES</Text>
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 20 }]}>
            What Drives Us
          </Text>
          <View style={styles.timeline}>
            {VALUES.map((item, i) => (
              <TimelineItem
                key={i}
                item={item}
                index={i}
                isLast={i === VALUES.length - 1}
              />
            ))}
          </View>
        </View>

        {/* UAE badge */}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <GlassCard glowColor={Colors.glowPurple}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 40 }}>🇦🇪</Text>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Proudly UAE-Based</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 4 }]}>
                  Serving businesses across Dubai, Abu Dhabi, and the wider Gulf region with excellence.
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  heroSection: { alignItems: 'center', paddingVertical: 30 },
  logoGlow: {
    shadowColor: Colors.teal,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 16,
  },
  logo: { width: 90, height: 90 },
  brandName: { ...Typography.h1, color: Colors.textPrimary, letterSpacing: 8 },
  divider: { height: 2, width: 80, borderRadius: 2, marginTop: 20, opacity: 0.7 },
  section: { marginBottom: 28 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },

  // Timeline styles
  timeline: { paddingLeft: 4 },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 52,
    paddingTop: 4,
  },
  timelineDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    padding: 16,
  },
});
