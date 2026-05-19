import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';

const { width } = Dimensions.get('window');

const SERVICES = [
  {
    icon: '🌐',
    title: 'Web Development',
    desc: 'We craft websites that do more than look good — they convert visitors into customers. From landing pages to full e-commerce platforms.',
    features: ['Custom Design', 'SEO Optimized', 'Mobile First', 'Fast Loading'],
    color: Colors.teal,
    glow: Colors.glowTeal,
  },
  {
    icon: '💡',
    title: 'IT Consulting',
    desc: 'Strategic technology guidance to help UAE businesses scale. We align your tech infrastructure with your growth goals.',
    features: ['Tech Strategy', 'System Audits', 'Cloud Migration', 'Security Review'],
    color: Colors.blue,
    glow: Colors.glowBlue,
  },
  {
    icon: '📱',
    title: 'Mobile Apps',
    desc: 'iOS and Android apps built with precision. We turn your idea into a polished product your customers will love using every day.',
    features: ['iOS & Android', 'UI/UX Design', 'API Integration', 'App Store Launch'],
    color: Colors.purple,
    glow: Colors.glowPurple,
  },
  {
    icon: '🚀',
    title: 'Digital Solutions',
    desc: 'End-to-end digital transformation. We modernize your operations, automate your workflows, and build systems that scale.',
    features: ['Process Automation', 'CRM Systems', 'Data Analytics', 'Digital Strategy'],
    color: Colors.teal,
    glow: Colors.glowTeal,
  },
  {
    icon: '🎨',
    title: 'Brand Identity',
    desc: 'Your brand is your first impression. We design identities that are distinctive, memorable, and built for the digital age.',
    features: ['Logo Design', 'Brand Guidelines', 'Social Media Kit', 'Print Assets'],
    color: Colors.blue,
    glow: Colors.glowBlue,
  },
  {
    icon: '📊',
    title: 'Digital Marketing',
    desc: 'Data-driven marketing strategies that get results. SEO, social media, and paid ads tailored for the UAE market.',
    features: ['SEO & SEM', 'Social Ads', 'Content Strategy', 'Analytics'],
    color: Colors.purple,
    glow: Colors.glowPurple,
  },
];

function ServiceCard({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 120),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY }, { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
      marginBottom: 16,
    }}>
      <GlassCard glowColor={item.glow}>
        <View style={styles.serviceHeader}>
          <View style={[styles.iconContainer, { shadowColor: item.color }]}>
            <LinearGradient
              colors={[item.color + '30', item.color + '10']}
              style={styles.iconBg}
            >
              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
            </LinearGradient>
          </View>
          <Text style={[Typography.h3, { color: Colors.textPrimary, flex: 1, marginLeft: 16 }]}>
            {item.title}
          </Text>
        </View>

        <Text style={[Typography.body, { color: Colors.textSecondary, marginVertical: 14 }]}>
          {item.desc}
        </Text>

        <View style={styles.featuresRow}>
          {item.features.map((f, i) => (
            <View key={i} style={[styles.featureTag, { borderColor: item.color + '50', backgroundColor: item.color + '15' }]}>
              <Text style={[Typography.bodySmall, { color: item.color }]}>{f}</Text>
            </View>
          ))}
        </View>

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

export default function ServicesScreen() {
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <VideoBackground source={require('../../assets/videos/services.mp4')} />

      <ScreenWrapper style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <Text style={styles.sectionLabel}>EXPERTISE</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary }]}>Our Services</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8, lineHeight: 26 }]}>
            From concept to launch, we deliver complete digital solutions built for UAE businesses ready to lead.
          </Text>
        </Animated.View>

        {SERVICES.map((item, i) => <ServiceCard key={i} item={item} index={i} />)}
        <View style={{ height: 120 }} />
      </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 28 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },
  serviceHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { shadowOpacity: 0.5, shadowRadius: 12, elevation: 6 },
  iconBg: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  featureTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  cardAccent: { height: 2, borderRadius: 2, marginTop: 16 },
});
