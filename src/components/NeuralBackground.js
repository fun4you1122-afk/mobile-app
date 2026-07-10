import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

// Deterministic pseudo-random so the constellation is stable across renders.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildLayer(seed, count, w, h, linkDist) {
  const rand = mulberry32(seed);
  const nodes = Array.from({ length: count }, () => ({
    x: 8 + rand() * (w - 16),
    y: 8 + rand() * (h - 16),
    r: 1 + rand() * 1.8,
  }));
  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < linkDist) links.push([i, j]);
    }
  }
  return { nodes, links };
}

function DriftLayer({ layer, color, w, h, duration, drift, phase }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(phase),
        Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
        Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, drift] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -drift * 0.6] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.55, 1, 0.55] });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, transform: [{ translateX }, { translateY }] }]}>
      <Svg width={w} height={h}>
        {layer.links.map(([i, j], k) => (
          <Line
            key={`l${k}`}
            x1={layer.nodes[i].x} y1={layer.nodes[i].y}
            x2={layer.nodes[j].x} y2={layer.nodes[j].y}
            stroke={color} strokeWidth={0.6} opacity={0.35}
          />
        ))}
        {layer.nodes.map((n, k) => (
          <Circle key={`n${k}`} cx={n.x} cy={n.y} r={n.r} fill={color} opacity={0.8} />
        ))}
      </Svg>
    </Animated.View>
  );
}

// Two slowly drifting constellation layers — reads as a live neural mesh but
// costs only two native-driver transforms.
export default function NeuralBackground({
  width = SCREEN_W,
  height = 420,
  colors = ['rgba(0,212,170,0.5)', 'rgba(124,58,237,0.45)'],
  density = 14,
  opacity = 1,
}) {
  const layers = useMemo(() => ([
    buildLayer(7, density, width, height, width * 0.28),
    buildLayer(23, Math.round(density * 0.75), width, height, width * 0.24),
  ]), [width, height, density]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width, height, opacity }}>
      <DriftLayer layer={layers[0]} color={colors[0]} w={width} h={height} duration={9000} drift={14} phase={0} />
      <DriftLayer layer={layers[1]} color={colors[1]} w={width} h={height} duration={12000} drift={-18} phase={1200} />
    </View>
  );
}
