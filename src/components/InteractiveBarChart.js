import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Typography } from '../theme/typography';
import { useTheme } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function Bar({ x, barW, maxH, baseY, value, maxValue, color, label, isActive, onPress, index, labelColor, valueColor }) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [animH, setAnimH] = useState(0);

  useEffect(() => {
    const listener = heightAnim.addListener(({ value: v }) => setAnimH(v));
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.spring(heightAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: false }),
    ]).start();
    return () => heightAnim.removeListener(listener);
  }, []);

  const barH = animH * (value / maxValue) * maxH;
  const barY = baseY - barH;
  const gradId = `grad_${index}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ position: 'absolute', left: x, width: barW, top: 0, bottom: 0 }}>
      <Svg width={barW} height={baseY + 30} style={{ overflow: 'visible' }}>
        <Defs>
          <SvgGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={isActive ? '1' : '0.8'} />
            <Stop offset="1" stopColor={color} stopOpacity="0.3" />
          </SvgGradient>
        </Defs>

        {/* Bar */}
        <Rect
          x={2}
          y={barY}
          width={barW - 4}
          height={barH}
          rx={6}
          fill={`url(#${gradId})`}
        />

        {/* Active highlight */}
        {isActive && <Rect x={2} y={barY} width={barW - 4} height={barH} rx={6} fill="rgba(255,255,255,0.12)" />}

        {/* Value label on top when active */}
        {isActive && barH > 0 && (
          <SvgText
            x={barW / 2}
            y={barY - 6}
            fontSize={11}
            fill={valueColor}
            textAnchor="middle"
            fontWeight="700"
          >
            {value}%
          </SvgText>
        )}

        {/* X-axis label — short, horizontal, never overlaps */}
        <SvgText
          x={barW / 2}
          y={baseY + 14}
          fontSize={8}
          fill={labelColor}
          textAnchor="middle"
        >
          {label.slice(0, 4)}
        </SvgText>
      </Svg>
    </TouchableOpacity>
  );
}

export default function InteractiveBarChart({
  data = [
    { label: 'Web', value: 35, color: '#00D4AA' },
    { label: 'Mobile', value: 28, color: '#3B5BDB' },
    { label: 'IT Consult', value: 20, color: '#7C3AED' },
    { label: 'Branding', value: 10, color: '#00D4AA' },
    { label: 'Marketing', value: 7, color: '#3B5BDB' },
  ],
  label = 'Service Breakdown',
  width: chartW,
  height: chartH = 160,
}) {
  const W = chartW || SCREEN_W - 64;
  const H = chartH;
  const PAD_V = 24;
  const maxH = H - PAD_V - 24;
  const baseY = H - 24;

  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);
  const maxValue = Math.max(...data.map(d => d.value));

  const barW = (W - 16) / data.length;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={[Typography.label, { color: colors.textSecondary }]}>{label}</Text>
        {activeIndex !== null && (
          <Text style={[Typography.label, { color: data[activeIndex].color }]}>
            {data[activeIndex].label}: {data[activeIndex].value}%
          </Text>
        )}
      </View>

      <View style={{ height: H + 24, position: 'relative' }}>
        {data.map((item, i) => (
          <Bar
            key={i}
            index={i}
            x={8 + i * barW}
            barW={barW}
            maxH={maxH}
            baseY={baseY}
            value={item.value}
            maxValue={maxValue}
            color={item.color}
            label={item.label}
            isActive={activeIndex === i}
            labelColor={colors.isDark ? 'rgba(255,255,255,0.55)' : 'rgba(17,24,39,0.55)'}
            valueColor={colors.textPrimary}
            onPress={() => setActiveIndex(activeIndex === i ? null : i)}
          />
        ))}
      </View>
    </View>
  );
}
