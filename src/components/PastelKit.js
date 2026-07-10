import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Easing, Dimensions, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icons';
import { useTheme } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────
// SoftCard — white rounded card with a soft colored shadow.
// The core surface of the pastel design language.
// ─────────────────────────────────────────────────────────────────
export function SoftCard({ children, style, onPress, padding = 18 }) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const body = (
    <Animated.View style={[{
      backgroundColor: colors.cardBg,
      borderRadius: 22,
      padding,
      shadowColor: colors.cardShadow,
      shadowOpacity: 1,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.border,
      transform: [{ scale }],
    }, style]}>
      {children}
    </Animated.View>
  );

  if (!onPress) return body;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 40 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 25, bounciness: 8 }).start()}
    >
      {body}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────
// IconChip — rounded-square pastel chip holding a vector icon.
// tone: 'purple' | 'cyan' | 'pink' | 'amber'
// ─────────────────────────────────────────────────────────────────
const TONES = {
  purple: { chip: 'chipPurple', accent: 'accentPurple' },
  cyan: { chip: 'chipCyan', accent: 'accentCyan' },
  pink: { chip: 'chipPink', accent: 'accentPink' },
  amber: { chip: 'chipAmber', accent: 'accentAmber' },
};

export function IconChip({ icon, tone = 'purple', size = 48, iconSize, radius }) {
  const { colors } = useTheme();
  const toneDef = TONES[tone] || TONES.purple;
  return (
    <View style={{
      width: size, height: size,
      borderRadius: radius ?? size * 0.32,
      backgroundColor: colors[toneDef.chip],
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={iconSize ?? size * 0.48} color={colors[toneDef.accent]} strokeWidth={1.9} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// PillButton — the big dark pill CTA ("View Detailed Report" style).
// ─────────────────────────────────────────────────────────────────
export function PillButton({ label, onPress, style, trailingIcon = 'arrowRight' }) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 25, bounciness: 9 }).start()}
    >
      <Animated.View style={[{
        backgroundColor: colors.pillBg,
        borderRadius: 999,
        paddingVertical: 17,
        paddingHorizontal: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }],
      }, style]}>
        <Text style={{ color: colors.pillText, fontSize: 15.5, fontWeight: '700', letterSpacing: 0.2 }}>
          {label}
        </Text>
        {trailingIcon ? (
          <View style={{ marginLeft: 8 }}>
            <Icon name={trailingIcon} size={16} color={colors.pillText} strokeWidth={2.2} />
          </View>
        ) : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────
// StatTile — pastel stat tile ("29 All / 13 Scheduled" style).
// ─────────────────────────────────────────────────────────────────
export function StatTile({ value, label, tone = 'purple', icon, style }) {
  const { colors } = useTheme();
  const toneDef = TONES[tone] || TONES.purple;
  return (
    <View style={[{
      backgroundColor: colors[toneDef.chip],
      borderRadius: 20,
      padding: 16,
      minHeight: 86,
      justifyContent: 'space-between',
    }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {icon ? <Icon name={icon} size={17} color={colors[toneDef.accent]} strokeWidth={2} /> : <View />}
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginTop: 8 }}>
        {label}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// ProgressRow — list row with title + animated progress bar + score.
// ("Science Quiz 3/10" style)
// ─────────────────────────────────────────────────────────────────
export function ProgressRow({ icon, tone = 'purple', title, valueLabel, ratio, index = 0 }) {
  const { colors } = useTheme();
  const toneDef = TONES[tone] || TONES.purple;
  const fill = useRef(new Animated.Value(0)).current;
  const [barW, setBarW] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(350 + index * 160),
      Animated.timing(fill, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);

  const widthAnim = fill.interpolate({ inputRange: [0, 1], outputRange: [0, barW * Math.min(1, Math.max(0, ratio))] });

  return (
    <SoftCard style={{ marginBottom: 12 }} padding={16}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconChip icon={icon} tone={tone} size={42} />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14.5, fontWeight: '700', color: colors.textPrimary }} numberOfLines={1}>
              {title}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginLeft: 8 }}>
              {valueLabel}
            </Text>
          </View>
          <View
            onLayout={(e) => setBarW(e.nativeEvent.layout.width)}
            style={{ height: 7, borderRadius: 4, backgroundColor: colors[toneDef.chip], marginTop: 9, overflow: 'hidden' }}
          >
            <Animated.View style={{
              height: '100%',
              width: widthAnim,
              borderRadius: 4,
              backgroundColor: colors[toneDef.accent],
            }} />
          </View>
        </View>
      </View>
    </SoftCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// DonutChart — animated segmented donut with center label.
// segments: [{ value, color }]
// ─────────────────────────────────────────────────────────────────
export function DonutChart({ segments, size = 132, thickness = 16, centerTitle, centerSub }) {
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const [p, setP] = useState(0);

  useEffect(() => {
    const listener = progress.addListener(({ value }) => setP(value));
    Animated.timing(progress, { toValue: 1, duration: 1300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => progress.removeListener(listener);
  }, []);

  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const R = (size - thickness) / 2;
  const C = size / 2;
  const circ = 2 * Math.PI * R;
  const GAP = circ * 0.02;

  let acc = 0;
  const arcs = segments.map((seg, i) => {
    const frac = seg.value / total;
    const start = acc;
    acc += frac;
    const lenFull = Math.max(0, frac * circ - GAP);
    const len = lenFull * p;
    return (
      <Circle
        key={i}
        cx={C} cy={C} r={R}
        stroke={seg.color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${len} ${circ - len}`}
        strokeDashoffset={-(start * circ + GAP / 2)}
        transform={`rotate(-90 ${C} ${C})`}
      />
    );
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={C} cy={C} r={R} stroke={colors.isDark ? 'rgba(255,255,255,0.07)' : '#F1EDF8'} strokeWidth={thickness} fill="none" />
        {arcs}
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 21, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 }}>
          {centerTitle}
        </Text>
        {centerSub ? (
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textMuted, marginTop: 2 }}>
            {centerSub}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// LegendRow — colored dot + percentage + label (donut legend).
// ─────────────────────────────────────────────────────────────────
export function LegendRow({ color, pct, label }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary, marginLeft: 10, width: 42 }}>
        {pct}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary, flex: 1 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// GreetingHeader — "Welcome / Name!" + avatar + bell, sample style.
// ─────────────────────────────────────────────────────────────────
export function GreetingHeader({ hello, name, avatar, onBellPress }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>{hello}</Text>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.6, marginTop: 2 }}>
          {name}
        </Text>
      </View>
      {onBellPress ? (
        <TouchableOpacity
          onPress={onBellPress}
          activeOpacity={0.8}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: colors.cardBg,
            alignItems: 'center', justifyContent: 'center',
            marginRight: 10,
            shadowColor: colors.cardShadow, shadowOpacity: 1, shadowRadius: 12, shadowOffset: { width: 0, height: 5 },
            elevation: 3,
          }}
        >
          <Icon name="chat" size={19} color={colors.textPrimary} strokeWidth={1.9} />
        </TouchableOpacity>
      ) : null}
      {avatar ? (
        <View style={{
          width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
          borderWidth: 2, borderColor: colors.accentPurple,
        }}>
          <Image source={avatar} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
      ) : null}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SectionHeader — "Select Quiz Type   View All" row.
// ─────────────────────────────────────────────────────────────────
export function SectionHeader({ title, actionLabel, onAction, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, style]}>
      <Text style={{ fontSize: 17.5, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 }}>
        {title}
      </Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// ListCard — "Aptitude Test / Measure your abilities →" row card.
// ─────────────────────────────────────────────────────────────────
export function ListCard({ icon, tone = 'purple', title, subtitle, onPress, index = 0 }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(120 + index * 90),
      Animated.spring(anim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }],
      marginBottom: 12,
    }}>
      <SoftCard onPress={onPress} padding={16}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconChip icon={icon} tone={tone} size={48} />
          <View style={{ flex: 1, marginHorizontal: 13 }}>
            <Text style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary }} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ fontSize: 12.5, fontWeight: '500', color: colors.textSecondary, marginTop: 3 }} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Icon name="arrowRight" size={17} color={colors.textPrimary} strokeWidth={2} />
        </View>
      </SoftCard>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────
// PastelBackground — soft blurred gradient blobs backdrop.
// Replaces video backgrounds in the pastel (light) theme.
// ─────────────────────────────────────────────────────────────────
export function PastelBackground({ height = 520 }) {
  const { colors } = useTheme();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(drift, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(drift, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const t1 = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 26] });
  const t2 = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });

  const blob = (bg, size) => ({
    position: 'absolute',
    width: size, height: size,
    borderRadius: size / 2,
    backgroundColor: bg,
  });

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height, overflow: 'hidden' }}>
      <Animated.View style={[blob(colors.isDark ? 'rgba(167,139,250,0.14)' : 'rgba(196,181,253,0.5)', 300), {
        top: -90, left: -70, transform: [{ translateX: t1 }, { translateY: t2 }],
      }]} />
      <Animated.View style={[blob(colors.isDark ? 'rgba(34,211,238,0.10)' : 'rgba(165,243,252,0.55)', 260), {
        top: 40, right: -80, transform: [{ translateX: t2 }, { translateY: t1 }],
      }]} />
      <Animated.View style={[blob(colors.isDark ? 'rgba(244,114,182,0.08)' : 'rgba(251,207,232,0.5)', 240), {
        top: 240, left: SCREEN_W * 0.3, transform: [{ translateX: t1 }, { translateY: t1 }],
      }]} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', colors.background]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 }}
      />
    </View>
  );
}
