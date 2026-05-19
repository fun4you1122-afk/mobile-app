import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const { width } = Dimensions.get('window');
const SIZE = (width - 64) / 2 - 8;
const RADIUS = SIZE / 2 - 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AnimatedGauge({ value, maxValue, label, color, unit = '', index = 0 }) {
  const progress = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const fillRatio = value / maxValue;
  const strokeDash = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - fillRatio)],
  });

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300 + index * 200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(progress, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(numberAnim, { toValue: 1, duration: 1400, useNativeDriver: false }),
      ]),
    ]).start();
  }, []);

  // Animated number display
  const [displayValue, setDisplayValue] = React.useState(0);
  useEffect(() => {
    const listener = numberAnim.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v * value));
    });
    return () => numberAnim.removeListener(listener);
  }, [value]);

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
      <View style={styles.gaugeWrapper}>
        {/* Background ring */}
        <View style={[styles.svgContainer]}>
          <View style={[styles.bgRing, {
            width: SIZE - 20, height: SIZE - 20,
            borderRadius: (SIZE - 20) / 2,
            borderColor: color + '20',
          }]} />
          {/* Animated fill ring using border trick */}
          <Animated.View style={[styles.progressRingOuter, {
            width: SIZE - 20, height: SIZE - 20,
            borderRadius: (SIZE - 20) / 2,
          }]}>
            <AnimatedArcView progress={progress} fillRatio={fillRatio} color={color} size={SIZE - 20} />
          </Animated.View>
        </View>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={[styles.valueText, { color }]}>
            {displayValue}{unit}
          </Text>
          <View style={[styles.dot, { backgroundColor: color }]} />
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

// Draws an animated arc using rotation trick
function AnimatedArcView({ progress, fillRatio, color, size }) {
  const rotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${fillRatio * 360}deg`],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.05, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 5,
        borderColor: 'transparent',
        borderTopColor: color,
        borderRightColor: fillRatio > 0.25 ? color : 'transparent',
        borderBottomColor: fillRatio > 0.5 ? color : 'transparent',
        borderLeftColor: fillRatio > 0.75 ? color : 'transparent',
        transform: [{ rotate: rotation }],
        opacity,
        shadowColor: color,
        shadowOpacity: 0.7,
        shadowRadius: 8,
        elevation: 6,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    alignItems: 'center',
    marginBottom: 16,
  },
  gaugeWrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
    width: SIZE - 20,
    height: SIZE - 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgRing: {
    position: 'absolute',
    borderWidth: 5,
  },
  progressRingOuter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  label: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});
