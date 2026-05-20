import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Asset } from 'expo-asset';

function VideoPlayer({ uri }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      nativeControls={false}
      contentFit="cover"
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
}

export default function VideoBackground({ source, lightMode = false }) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    let mounted = true;
    Asset.fromModule(source).downloadAsync().then((asset) => {
      if (mounted) setUri(asset.localUri || asset.uri);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {uri ? <VideoPlayer uri={uri} /> : null}
      <LinearGradient
        colors={lightMode
          ? ['rgba(240,242,248,0.45)', 'rgba(240,242,248,0.75)', '#F0F2F8']
          : ['rgba(5,8,21,0.4)', 'rgba(5,8,21,0.7)', '#050815']}
        locations={[0, 0.65, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
}
