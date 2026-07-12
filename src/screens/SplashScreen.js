import React, { useEffect, useRef } from 'react';
import {
  View, Image, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme/colors';
import { Typography } from '../theme/typography';
import AIOrb from '../components/AIOrb';
import GradientText from '../components/GradientText';
import NeuralBackground from '../components/NeuralBackground';
import { DecorField } from '../components/Doodles';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const ringScale1 = useRef(new Animated.Value(0)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringScale2 = useRef(new Animated.Value(0)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo appears with spring
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),

      // 2. Glow pulse rings burst outward
      Animated.parallel([
        Animated.timing(ringScale1, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(ringOpacity1, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),

      // 3. Tagline slides up
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(taglineY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(ringOpacity1, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(ringScale2, { toValue: 1.8, duration: 800, useNativeDriver: true }),
        Animated.timing(ringOpacity2, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),

      // 4. Subtitle
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),

      // 5. Hold
      Animated.delay(1200),

      // 6. Fade out entire screen
      Animated.timing(screenOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      navigation.replace('Main');
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#F6F1FB', '#EFE7F8', '#F6F1FB']} style={StyleSheet.absoluteFill} />
      <NeuralBackground height={height} opacity={0.3} colors={['rgba(139,92,246,0.45)', 'rgba(6,182,212,0.4)']} />

      <DecorField items={[
        { name: 'sparkle', x: '14%', y: '20%', size: 26, color: '#F59E0B', rotate: 10 },
        { name: 'sparkle', x: '82%', y: '30%', size: 16, color: '#EC4899', rotate: -14 },
        { name: 'ring', x: '78%', y: '16%', size: 30, color: '#06B6D4', opacity: 0.7 },
        { name: 'plus', x: '10%', y: '68%', size: 16, color: '#8B5CF6', rotate: 20, opacity: 0.8 },
        { name: 'squiggle', x: '76%', y: '72%', size: 30, color: '#8B5CF6', rotate: -10, opacity: 0.7 },
        { name: 'dots', x: '20%', y: '80%', size: 26, color: '#EC4899', opacity: 0.6 },
      ]} />

      {/* AI core behind the logo */}
      <View style={styles.orbWrap} pointerEvents="none">
        <AIOrb size={280} coreScale={0.3} />
      </View>

      {/* Animated glow rings */}
      <Animated.View style={[styles.ring, {
        width: 260, height: 260,
        transform: [{ scale: ringScale1 }],
        opacity: ringOpacity1,
        borderColor: 'rgba(139,92,246,0.5)',
      }]} />
      <Animated.View style={[styles.ring, {
        width: 300, height: 300,
        transform: [{ scale: ringScale2 }],
        opacity: ringOpacity2,
        borderColor: 'rgba(236,72,153,0.4)',
      }]} />

      {/* Logo */}
      <Animated.View style={{
        transform: [{ scale: logoScale }],
        opacity: logoOpacity,
        shadowColor: '#8B5CF6',
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 20,
      }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{
        opacity: taglineOpacity,
        transform: [{ translateY: taglineY }],
        alignItems: 'center',
        marginTop: 32,
      }}>
        <GradientText style={styles.tagline}>WETHINK</GradientText>
        <Animated.View style={{ opacity: subtitleOpacity }}>
          <Text style={styles.subtitle}>We think big. You achieve bigger.</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>IT CONSULTING · DIGITAL SOLUTIONS</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F1FB',
  },
  logo: {
    width: 140,
    height: 140,
  },
  tagline: {
    ...Typography.h1,
    color: '#111827',
    letterSpacing: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    ...Typography.label,
    color: '#8B5CF6',
    textAlign: 'center',
    marginTop: 14,
  },
  divider: {
    height: 1,
    width: 60,
    backgroundColor: '#8B5CF6',
    alignSelf: 'center',
    marginTop: 14,
    opacity: 0.5,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  orbWrap: {
    position: 'absolute',
    top: height / 2 - 210,
    alignSelf: 'center',
  },
});
