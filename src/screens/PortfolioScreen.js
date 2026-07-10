import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, Dimensions, StatusBar,
  TouchableOpacity, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icons';
import { PastelBackground, StatTile } from '../components/PastelKit';
import { useTheme } from '../context/AppContext';

const { width } = Dimensions.get('window');

// CATEGORIES and QUICK_STATS are built inside the component using t()

function FeaturedProjectCard({ item }) {
  const { colors, t } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(anim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }], marginBottom: 20 }}>
      <GlassCard glowColor={item.color + '80'}>
        <LinearGradient
          colors={[item.color + '40', item.color + '10']}
          style={styles.featuredImageArea}
        >
          <Icon name={item.icon} size={72} color={item.color} strokeWidth={1.4} />
          <View style={[styles.featuredBadge, { backgroundColor: item.color }]}>
            <Text style={[Typography.label, { color: '#fff', fontSize: 10 }]}>{t('featured')}</Text>
          </View>
        </LinearGradient>

        <View style={styles.featuredContent}>
          <View style={[styles.categoryBadge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
            <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.category}</Text>
          </View>
          <Text style={[Typography.h2, { color: colors.textPrimary, marginTop: 8 }]}>{item.title}</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 10, lineHeight: 26 }]}>
            {item.desc}
          </Text>

          <View style={styles.tagsRow}>
            {item.tags.map((tag, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: colors.surface }]}>
                <Text style={[Typography.bodySmall, { color: colors.textMuted }]}>#{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.discussBtn, { borderColor: item.color + '80', backgroundColor: item.color + '15' }]}
            onPress={() => Linking.openURL('https://wa.me/971503125078')}
            activeOpacity={0.8}
          >
            <Text style={[Typography.button, { color: item.color, fontSize: 14 }]}>{t('discuss')}</Text>
          </TouchableOpacity>
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

function ProjectCard({ item, index }) {
  const { colors, t } = useTheme();
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
            <Icon name={item.icon} size={26} color={item.color} strokeWidth={1.7} />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[Typography.h4, { color: colors.textPrimary }]}>{item.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
              <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.category}</Text>
            </View>
          </View>
        </View>

        <Text style={[Typography.body, { color: colors.textSecondary, marginVertical: 12 }]}>
          {item.desc}
        </Text>

        <View style={styles.tagsRow}>
          {item.tags.map((tag, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: colors.surface }]}>
              <Text style={[Typography.bodySmall, { color: colors.textMuted }]}>#{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.discussBtn, { borderColor: item.color + '80', backgroundColor: item.color + '15' }]}
          onPress={() => Linking.openURL('https://wa.me/971503125078')}
          activeOpacity={0.8}
        >
          <Text style={[Typography.button, { color: item.color, fontSize: 14 }]}>{t('discuss')}</Text>
        </TouchableOpacity>
      </GlassCard>
    </Animated.View>
  );
}

export default function PortfolioScreen() {
  const { colors, t, isDark } = useTheme();
  const CATEGORIES_KEYS = ['catAll', 'catWebFilter', 'catMobileFilter', 'catBrandingFilter', 'catConsultingFilter'];
  const CATEGORIES = CATEGORIES_KEYS.map(k => t(k));
  const [activeCategory, setActiveCategory] = useState(t('catAll'));
  const headerAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;

  const QUICK_STATS = [
    { value: t('statProjects'), label: t('statProjectsLabel') },
    { value: t('statYears'), label: t('statYearsLabel') },
    { value: t('statUae'), label: t('statUaeLabel') },
  ];

  // Map translated category names back to English for filtering
  const catMap = {
    [t('catAll')]: 'All',
    [t('catWebFilter')]: 'Web',
    [t('catMobileFilter')]: 'Mobile',
    [t('catBrandingFilter')]: 'Branding',
    [t('catConsultingFilter')]: 'Consulting',
  };

  const PROJECTS = [
    { title: t('proj1Title'), category: 'Web', desc: t('proj1Desc'), tags: t('proj1Tags'), color: colors.teal, icon: 'globe' },
    { title: t('proj2Title'), category: 'Mobile', desc: t('proj2Desc'), tags: t('proj2Tags'), color: colors.blue, icon: 'cart' },
    { title: t('proj3Title'), category: 'Branding', desc: t('proj3Desc'), tags: t('proj3Tags'), color: colors.purple, icon: 'palette' },
    { title: t('proj4Title'), category: 'Consulting', desc: t('proj4Desc'), tags: t('proj4Tags'), color: colors.teal, icon: 'cloud' },
    { title: t('proj5Title'), category: 'Web', desc: t('proj5Desc'), tags: t('proj5Tags'), color: colors.blue, icon: 'building' },
    { title: t('proj6Title'), category: 'Mobile', desc: t('proj6Desc'), tags: t('proj6Tags'), color: colors.purple, icon: 'heartPulse' },
  ];

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.spring(filterAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const englishCat = catMap[activeCategory] ?? 'All';
  const filtered = englishCat === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === englishCat);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="transparent" translucent />
      {isDark
        ? <VideoBackground source={require('../../assets/videos/portfolio.mp4')} lightMode={false} />
        : <PastelBackground height={520} />}

      <ScreenWrapper style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <Text style={[styles.sectionLabel, { color: colors.teal }]}>{t('ourWork')}</Text>
          <Text style={[Typography.h1, { color: colors.textPrimary }]}>{t('portfolioTitle')}</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
            {t('portfolioSub')}
          </Text>
        </Animated.View>

        {/* Quick Stats */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatTile value={QUICK_STATS[0].value} label={QUICK_STATS[0].label} tone="purple" icon="layers" style={{ flex: 1, marginRight: 5 }} />
          <StatTile value={QUICK_STATS[1].value} label={QUICK_STATS[1].label} tone="cyan" icon="check" style={{ flex: 1, marginHorizontal: 5 }} />
          <StatTile value={QUICK_STATS[2].value} label={QUICK_STATS[2].label} tone="pink" icon="pin" style={{ flex: 1, marginLeft: 5 }} />
        </View>

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
                  colors={['#8B5CF6', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.filterActive}
                >
                  <Text style={[Typography.label, { color: '#fff' }]}>{cat}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.filterInactive, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                  <Text style={[Typography.label, { color: colors.textSecondary }]}>{cat}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>

        {featured && <FeaturedProjectCard item={featured} />}
        {rest.map((item, i) => <ProjectCard key={item.title} item={item} index={i} />)}
        <View style={{ height: 120 }} />
      </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 20 },
  sectionLabel: { ...Typography.label, marginBottom: 8 },

  statsStrip: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { ...Typography.h2, fontSize: 24 },
  statLabel: { ...Typography.bodySmall, marginTop: 2 },
  statDivider: { width: 1, height: 36 },

  filterRow: { marginBottom: 20, marginHorizontal: -16 },
  filterActive: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  filterInactive: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1,
  },

  featuredImageArea: {
    height: 180,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredContent: { paddingHorizontal: 4 },

  projectHeader: { flexDirection: 'row', alignItems: 'center' },
  projectIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discussBtn: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardAccent: { height: 2, borderRadius: 2, marginTop: 12 },
});
