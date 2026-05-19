import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, Dimensions, StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Web', 'Mobile', 'Branding', 'Consulting'];

const PROJECTS = [
  { title: 'Digital Presence Platform', category: 'Web', desc: 'A full digital suite for a UAE enterprise — website, admin panel, and CRM integration.', tags: ['React', 'Node.js', 'UAE'], color: Colors.teal, icon: '🌐' },
  { title: 'E-Commerce Mobile App', category: 'Mobile', desc: 'iOS & Android shopping app with AR product preview and one-tap checkout.', tags: ['React Native', 'iOS', 'Android'], color: Colors.blue, icon: '📱' },
  { title: 'Corporate Rebrand', category: 'Branding', desc: 'Complete brand identity overhaul for a Dubai-based financial services firm.', tags: ['Identity', 'UI Kit', 'Dubai'], color: Colors.purple, icon: '🎨' },
  { title: 'Cloud Migration Strategy', category: 'Consulting', desc: 'Led a 3-month cloud migration for a 200-person company with zero downtime.', tags: ['AWS', 'Strategy', 'DevOps'], color: Colors.teal, icon: '☁️' },
  { title: 'Real Estate Portal', category: 'Web', desc: 'Property listing and virtual tour platform targeting the UAE luxury market.', tags: ['Next.js', '3D Tours', 'Bilingual'], color: Colors.blue, icon: '🏢' },
  { title: 'HealthTech Dashboard', category: 'Mobile', desc: 'Patient management mobile app for a network of UAE clinics.', tags: ['React Native', 'HL7', 'Arabic'], color: Colors.purple, icon: '🏥' },
];

function ProjectCard({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }], marginBottom: 16 }}>
      <GlassCard glowColor={item.color + '60'}>
        <View style={styles.projectHeader}>
          <LinearGradient
            colors={[item.color + '30', item.color + '10']}
            style={styles.projectIcon}
          >
            <Text style={{ fontSize: 26 }}>{item.icon}</Text>
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{item.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
              <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.category}</Text>
            </View>
          </View>
        </View>

        <Text style={[Typography.body, { color: Colors.textSecondary, marginVertical: 12 }]}>
          {item.desc}
        </Text>

        <View style={styles.tagsRow}>
          {item.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default function PortfolioScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const headerAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.spring(filterAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const filtered = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <VideoBackground source={require('../../assets/videos/portfolio.mp4')} />
      <AnimatedGradientBackground />

      <ScreenWrapper style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <Text style={styles.sectionLabel}>OUR WORK</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary }]}>Portfolio</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>
            Real projects. Real results. Built for UAE businesses.
          </Text>
        </Animated.View>

        {/* Category filter */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.filterRow, { opacity: filterAnim }]}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              {activeCategory === cat ? (
                <LinearGradient
                  colors={['#00D4AA', '#3B5BDB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.filterActive}
                >
                  <Text style={[Typography.label, { color: Colors.white }]}>{cat}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterInactive}>
                  <Text style={[Typography.label, { color: Colors.textSecondary }]}>{cat}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>

        {filtered.map((item, i) => <ProjectCard key={item.title} item={item} index={i} />)}
        <View style={{ height: 120 }} />
      </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 20 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },
  filterRow: { marginBottom: 20, marginHorizontal: -16 },
  filterActive: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  filterInactive: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  projectHeader: { flexDirection: 'row', alignItems: 'center' },
  projectIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.surface },
});
