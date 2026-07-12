import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, StatusBar, Image, TouchableOpacity,
} from 'react-native';
import { Typography } from '../theme/typography';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';
import InteractiveLineChart from '../components/InteractiveLineChart';
import InteractiveBarChart from '../components/InteractiveBarChart';
import Icon from '../components/Icons';
import {
  SoftCard, IconChip, PillButton, StatTile, ProgressRow,
  DonutChart, LegendRow, GreetingHeader, SectionHeader, ListCard, PastelBackground,
} from '../components/PastelKit';
import { Doodle, DecorField } from '../components/Doodles';
import { SceneLaptop, SceneRocket } from '../components/VectorScenes';
import { useTheme } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { colors, t, isDark } = useTheme();
  const heroAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(heroAnim, { toValue: 1, tension: 45, friction: 8, useNativeDriver: true }).start();
  }, []);

  const SERVICES = [
    { icon: 'globe', tone: 'purple', title: t('svcWebTitle'), subtitle: t('svcWebDesc') },
    { icon: 'lightbulb', tone: 'amber', title: t('svcItTitle'), subtitle: t('svcItDesc') },
    { icon: 'smartphone', tone: 'cyan', title: t('svcMobileTitle'), subtitle: t('svcMobileDesc') },
    { icon: 'rocket', tone: 'pink', title: t('svcDigitalTitle'), subtitle: t('svcDigitalDesc') },
  ];

  const RESULTS = [
    { icon: 'globe', tone: 'purple', title: t('work1Title'), valueLabel: '9/10', ratio: 0.9 },
    { icon: 'cart', tone: 'cyan', title: t('work2Title'), valueLabel: '8/10', ratio: 0.8 },
    { icon: 'palette', tone: 'pink', title: t('work3Title'), valueLabel: '10/10', ratio: 1 },
  ];

  const DONUT = [
    { value: 40, color: colors.accentPurple, label: t('svcWebTitle') },
    { value: 25, color: colors.accentCyan, label: t('svcMobileTitle') },
    { value: 20, color: colors.accentPink, label: t('svcItTitle') },
    { value: 15, color: colors.accentAmber, label: t('svcMarketingTitle') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="transparent" translucent />
      {isDark
        ? <VideoBackground source={require('../../assets/videos/home.mp4')} lightMode={false} />
        : <PastelBackground height={560} />}

      <ScreenWrapper style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Greeting */}
          <GreetingHeader
            hello={t('welcome')}
            name="WeThink"
            avatar={require('../../assets/images/ceo.jpg')}
            onBellPress={() => navigation.navigate('Contact')}
          />

          {/* Hero card */}
          <Animated.View style={{
            opacity: heroAnim,
            transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            marginTop: 20,
          }}>
            <SoftCard padding={20}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{t('letsStart')}</Text>
                  <Text style={[styles.heroSub, { color: colors.textSecondary }]}>{t('heroCardSub')}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Services')}
                    activeOpacity={0.85}
                    style={[styles.heroArrow, { backgroundColor: colors.pillBg }]}
                  >
                    <Icon name="arrowRight" size={18} color={colors.pillText} strokeWidth={2.2} />
                  </TouchableOpacity>
                </View>
                <SceneLaptop size={148} />
              </View>
              <DecorField items={[
                { name: 'sparkle', x: '46%', y: 8, size: 15, color: colors.accentAmber, rotate: 12 },
                { name: 'plus', x: '52%', y: '78%', size: 12, color: colors.accentPink, rotate: 20, opacity: 0.8 },
              ]} />
            </SoftCard>
          </Animated.View>

          {/* Services */}
          <SectionHeader
            title={t('selectService')}
            actionLabel={t('viewAll')}
            onAction={() => navigation.navigate('Services')}
            style={{ marginTop: 26 }}
          />
          {SERVICES.map((s, i) => (
            <ListCard
              key={i}
              index={i}
              icon={s.icon}
              tone={s.tone}
              title={s.title}
              subtitle={s.subtitle}
              onPress={() => navigation.navigate('Services')}
            />
          ))}

          {/* Impact donut */}
          <SectionHeader title={t('ourImpact')} style={{ marginTop: 16 }} />
          <SoftCard padding={20}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <DonutChart
                segments={DONUT}
                size={132}
                thickness={16}
                centerTitle="93%"
                centerSub={t('gaugeSatisfaction')}
              />
              <View style={{ flex: 1, marginLeft: 20 }}>
                {DONUT.map((d, i) => (
                  <LegendRow key={i} color={d.color} pct={`${d.value}%`} label={d.label} />
                ))}
              </View>
            </View>
          </SoftCard>

          {/* Stat tiles */}
          <View style={styles.tileRow}>
            <StatTile value="50+" label={t('gaugeProjects')} tone="purple" icon="layers" style={{ flex: 1, marginRight: 6 }} />
            <StatTile value="8K" label={t('gaugeFollowing')} tone="cyan" icon="trending" style={{ flex: 1, marginLeft: 6 }} />
          </View>
          <View style={[styles.tileRow, { marginTop: 12 }]}>
            <StatTile value="24x" label={t('gaugeRoi')} tone="amber" icon="chart" style={{ flex: 1, marginRight: 6 }} />
            <StatTile value="5+" label={t('statYearsLabel')} tone="pink" icon="check" style={{ flex: 1, marginLeft: 6 }} />
          </View>

          {/* Recent results */}
          <SectionHeader
            title={t('recentResults')}
            actionLabel={t('viewAll')}
            onAction={() => navigation.navigate('Portfolio')}
            style={{ marginTop: 26 }}
          />
          {RESULTS.map((r, i) => (
            <ProgressRow key={i} index={i} {...r} />
          ))}

          {/* Interactive charts */}
          <SectionHeader title={t('liveInsights')} style={{ marginTop: 16 }} />
          <SoftCard padding={18}>
            <InteractiveLineChart
              data={[8, 12, 10, 18, 22, 19, 28, 33, 31, 38, 44, 50]}
              label={t('chartLineLabel')}
              color={colors.accentPurple}
              unit="clients"
            />
          </SoftCard>
          <SoftCard padding={18} style={{ marginTop: 12 }}>
            <InteractiveBarChart
              label={t('chartBarLabel')}
              data={[
                { label: 'Web', value: 35, color: colors.accentPurple },
                { label: 'Mobile', value: 28, color: colors.accentCyan },
                { label: 'Consult', value: 20, color: colors.accentPink },
                { label: 'Brand', value: 10, color: colors.accentAmber },
                { label: 'Mktg', value: 7, color: colors.accentPurple },
              ]}
            />
          </SoftCard>

          {/* Promo banner — Canva-style slogan card with doodles */}
          <View style={[styles.promoBanner, { backgroundColor: colors.chipPurple }]}>
            <DecorField items={[
              { name: 'sparkle', x: 16, y: 16, size: 22, color: colors.accentAmber, rotate: 8 },
              { name: 'sparkle', x: '88%', y: '58%', size: 15, color: colors.accentPink, rotate: -14 },
              { name: 'ring', x: '86%', y: 12, size: 30, color: colors.accentCyan, opacity: 0.75 },
              { name: 'squiggle', x: 12, y: '74%', size: 30, color: colors.accentPurple, rotate: -10, opacity: 0.8 },
              { name: 'puzzle', x: '68%', y: '84%', size: 18, color: colors.accentPink, rotate: 16, opacity: 0.7 },
              { name: 'dots', x: '8%', y: '42%', size: 22, color: colors.accentCyan, opacity: 0.6 },
            ]} />
            <View style={{ alignItems: 'center' }}>
              <SceneRocket size={132} />
              <Text style={[styles.promoTitle, { color: colors.textPrimary }]}>{t('heroSlogan')}</Text>
              <Text style={[styles.promoSub, { color: colors.textSecondary }]}>{t('heroTagline')}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Contact')}
                activeOpacity={0.85}
                style={[styles.promoArrow, { backgroundColor: colors.pillBg }]}
              >
                <Icon name="arrowRight" size={20} color={colors.pillText} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          <PillButton
            label={t('getQuote').replace(' →', '').replace(' ←', '')}
            style={{ marginTop: 24 }}
            onPress={() => navigation.navigate('WebView', {
              url: 'https://www.refrens.com/en-ae/free-online-quotation-generator',
              title: t('getQuote'),
              color: colors.accentPurple,
            })}
          />

          <View style={{ height: 120 }} />
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 66, paddingBottom: 20 },
  heroTitle: { fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  heroSub: { fontSize: 13, fontWeight: '500', lineHeight: 19, marginTop: 6 },
  heroArrow: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 16,
  },
  tileRow: { flexDirection: 'row', marginTop: 12 },
  promoBanner: {
    marginTop: 28,
    borderRadius: 26,
    paddingVertical: 26,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: 10,
  },
  promoSub: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 8,
  },
  promoArrow: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 18,
  },
});
