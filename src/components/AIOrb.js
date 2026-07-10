import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, {
  Circle, Defs, LinearGradient as SvgGradient, RadialGradient as SvgRadial, Stop,
} from 'react-native-svg';

let orbSeq = 0;

// Animated "AI core" orb: pulsing radial-gradient nucleus, two counter-rotating
// gradient arcs, and a slow orbiting particle ring. All animation runs on the
// native driver (rotation/scale/opacity of wrapper views); the SVG is static.
export default function AIOrb({
  size = 170,
  colors = ['#00D4AA', '#3B5BDB', '#7C3AED'],
  coreScale = 0.34,
}) {
  const ids = useRef({
    core: `orbCore${++orbSeq}`,
    arcA: `orbArcA${orbSeq}`,
    arcB: `orbArcB${orbSeq}`,
  }).current;

  const spinA = useRef(new Animated.Value(0)).current;
  const spinB = useRef(new Animated.Value(0)).current;
  const spinDots = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      Animated.loop(Animated.timing(spinA, {
        toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true, isInteraction: false,
      })),
      Animated.loop(Animated.timing(spinB, {
        toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true, isInteraction: false,
      })),
      Animated.loop(Animated.timing(spinDots, {
        toValue: 1, duration: 22000, easing: Easing.linear, useNativeDriver: true, isInteraction: false,
      })),
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2100, easing: Easing.inOut(Easing.quad), useNativeDriver: true, isInteraction: false }),
        Animated.timing(pulse, { toValue: 0, duration: 2100, easing: Easing.inOut(Easing.quad), useNativeDriver: true, isInteraction: false }),
      ])),
    ];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const rotA = spinA.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotB = spinB.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const rotDots = spinDots.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const coreScaleAnim = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.95] });

  const S = size;
  const C = S / 2;
  const rArcA = C - 6;
  const rArcB = C - 16;
  const rCore = S * coreScale;
  const rDots = C - 11;
  const circA = 2 * Math.PI * rArcA;
  const circB = 2 * Math.PI * rArcB;

  const [c1, c2, c3] = [colors[0], colors[1] || colors[0], colors[2] || colors[0]];

  return (
    <View style={{ width: S, height: S, alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulsing core */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: glowOpacity, transform: [{ scale: coreScaleAnim }] }]}>
        <Svg width={S} height={S}>
          <Defs>
            <SvgRadial id={ids.core} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
              <Stop offset="0.25" stopColor={c1} stopOpacity="0.9" />
              <Stop offset="0.6" stopColor={c2} stopOpacity="0.45" />
              <Stop offset="1" stopColor={c3} stopOpacity="0" />
            </SvgRadial>
          </Defs>
          <Circle cx={C} cy={C} r={rCore * 1.55} fill={`url(#${ids.core})`} />
        </Svg>
      </Animated.View>

      {/* Fast arc ring */}
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotA }] }]}>
        <Svg width={S} height={S}>
          <Defs>
            <SvgGradient id={ids.arcA} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={c1} />
              <Stop offset="1" stopColor={c3} />
            </SvgGradient>
          </Defs>
          <Circle
            cx={C} cy={C} r={rArcA}
            stroke={`url(#${ids.arcA})`} strokeWidth={1.6} fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circA * 0.42} ${circA * 0.58}`}
          />
        </Svg>
      </Animated.View>

      {/* Slow counter-rotating arc ring */}
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotB }] }]}>
        <Svg width={S} height={S}>
          <Defs>
            <SvgGradient id={ids.arcB} x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={c2} />
              <Stop offset="1" stopColor={c1} />
            </SvgGradient>
          </Defs>
          <Circle
            cx={C} cy={C} r={rArcB}
            stroke={`url(#${ids.arcB})`} strokeWidth={1.1} fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circB * 0.22} ${circB * 0.11} ${circB * 0.05} ${circB * 0.62}`}
            opacity={0.85}
          />
        </Svg>
      </Animated.View>

      {/* Orbiting particles */}
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotDots }] }]}>
        <Svg width={S} height={S}>
          {[0, 120, 240].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = C + rDots * Math.cos(rad);
            const y = C + rDots * Math.sin(rad);
            return (
              <Circle
                key={i} cx={x} cy={y} r={i === 0 ? 3 : 2}
                fill={[c1, c2, c3][i]}
                opacity={0.9}
              />
            );
          })}
        </Svg>
      </Animated.View>
    </View>
  );
}
