import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  StatusBar, ActivityIndicator, BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export default function WebViewScreen({ route, navigation }) {
  const { url, title, color = Colors.teal } = route.params;
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleProgress = ({ nativeEvent }) => {
    const p = nativeEvent.progress;
    setProgress(p);
    Animated.timing(progressAnim, { toValue: p, duration: 200, useNativeDriver: false }).start();
    if (p >= 1) {
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <LinearGradient
        colors={[Colors.background, 'rgba(5,8,21,0.95)']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={{ color: color, fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={[Typography.h4, { color: Colors.textPrimary, flex: 1 }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {canGoBack && (
          <TouchableOpacity onPress={() => webViewRef.current?.goBack()} style={styles.navBtn} activeOpacity={0.7}>
            <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>↩</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.navBtn} activeOpacity={0.7}>
          <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>↻</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Progress bar */}
      {loading && (
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, {
            backgroundColor: color,
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }]} />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        onLoadProgress={handleProgress}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={color} />
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 12 }]}>
              Loading {title}…
            </Text>
          </View>
        )}
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  titleRow: { flex: 1, paddingHorizontal: 12 },
  navBtn: {
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, marginLeft: 6,
  },
  progressTrack: { height: 2, backgroundColor: 'transparent' },
  progressBar: { height: 2 },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
