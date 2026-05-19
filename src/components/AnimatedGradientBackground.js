import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AnimatedGradientBackground() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 4000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 4000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const orb1X = anim.interpolate({ inputRange: [0, 1], outputRange: [-80, 60] });
  const orb1Y = anim.interpolate({ inputRange: [0, 1], outputRange: [height * 0.1, height * 0.25] });
  const orb2X = anim.interpolate({ inputRange: [0, 1], outputRange: [width - 60, width - 160] });
  const orb2Y = anim.interpolate({ inputRange: [0, 1], outputRange: [height * 0.4, height * 0.3] });
  const orb3Y = anim.interpolate({ inputRange: [0, 1], outputRange: [height * 0.7, height * 0.6] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Orb 1 - teal */}
      <Animated.View
        style={[styles.orb, {
          width: 280, height: 280,
          backgroundColor: 'rgba(0,212,170,0.12)',
          transform: [{ translateX: orb1X }, { translateY: orb1Y }],
        }]}
      />
      {/* Orb 2 - purple */}
      <Animated.View
        style={[styles.orb, {
          width: 320, height: 320,
          backgroundColor: 'rgba(124,58,237,0.1)',
          transform: [{ translateX: orb2X }, { translateY: orb2Y }],
        }]}
      />
      {/* Orb 3 - blue */}
      <Animated.View
        style={[styles.orb, {
          width: 240, height: 240,
          backgroundColor: 'rgba(59,91,219,0.1)',
          left: width * 0.2,
          transform: [{ translateY: orb3Y }],
        }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
});
