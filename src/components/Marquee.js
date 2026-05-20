import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';

export default function Marquee({ text, color = 'rgba(255,255,255,0.35)', speed = 45, fontSize = 11 }) {
  const SEP = '   ·   ';
  const segment = text + SEP;
  const translateX = useRef(new Animated.Value(0)).current;
  const [segW, setSegW] = useState(null);

  useEffect(() => {
    if (!segW) return;
    translateX.setValue(0);
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -segW,
        duration: (segW / speed) * 1000,
        useNativeDriver: true,
        isInteraction: false,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [segW]);

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        {[0, 1, 2, 3].map((i) => (
          <Text
            key={i}
            onLayout={i === 0 ? (e) => setSegW(e.nativeEvent.layout.width) : undefined}
            style={{ color, fontSize, letterSpacing: 1.5, fontWeight: '600' }}
          >
            {segment}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}
