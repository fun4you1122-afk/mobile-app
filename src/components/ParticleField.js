import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const PARTICLE_COUNT = 30;

function Particle({ delay }) {
  const x = useRef(Math.random() * width).current;
  const translateY = useRef(new Animated.Value(height + 20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const size = useRef(Math.random() * 4 + 1).current;
  const duration = useRef(8000 + Math.random() * 8000).current;

  const colors = ['rgba(0,212,170,', 'rgba(59,91,219,', 'rgba(124,58,237,'];
  const color = useRef(colors[Math.floor(Math.random() * colors.length)]).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(height + 20);
      opacity.setValue(0);
      scale.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -20,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
            Animated.delay(duration - 2000),
            Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.delay(duration - 1600),
            Animated.timing(scale, { toValue: 0, duration: 800, useNativeDriver: true }),
          ]),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: `${color}0.9)`,
        shadowColor: `${color}1)`,
        shadowOpacity: 1,
        shadowRadius: size * 3,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
}

export default function ParticleField() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} delay={i * 300} />
      ))}
    </View>
  );
}
