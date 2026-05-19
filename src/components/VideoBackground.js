import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

export default function VideoBackground({ source, style }) {
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <Video
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />
      <LinearGradient
        colors={['rgba(5,8,21,0.55)', 'rgba(5,8,21,0.8)', '#050815']}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
}
