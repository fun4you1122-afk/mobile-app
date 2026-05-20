import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';

const TOOLS = [
  {
    icon: '🤖',
    name: 'WeGPT',
    tagline: 'AI-Powered Assistant',
    desc: 'Ask anything. Get instant AI answers powered by deep learning. Research, write, and think smarter.',
    color: Colors.teal,
    glow: Colors.glowTeal,
    url: 'https://deepai.org/chat',
    badge: 'AI CHAT',
  },
  {
    icon: '💡',
    name: 'Rasha Instant Consultation',
    tagline: 'Smart Business Research',
    desc: 'Get expert-level answers on IT strategy, market insights, and business decisions — instantly.',
    color: Colors.purple,
    glow: Colors.glowPurple,
    url: 'https://www.perplexity.ai/',
    badge: 'CONSULTATION',
  },
  {
    icon: '📊',
    name: 'Data Analysis Suite',
    tagline: 'CRM · Payroll · Analytics',
    desc: 'Full business intelligence: manage customers, run payroll, analyse data, and automate workflows.',
    color: Colors.blue,
    glow: Colors.glowBlue,
    url: 'https://www.zoho.com/',
    badge: 'BUSINESS',
  },
  {
    icon: '📋',
    name: 'Quote Generator',
    tagline: 'Professional Quotations',
    desc: 'Create stunning, professional quotes and invoices for your clients in minutes. Free online tool.',
    color: Colors.teal,
    glow: Colors.glowTeal,
    url: 'https://www.refrens.com/en-ae/free-online-quotation-generator',
    badge: 'QUOTES',
  },
];

function ToolCard({ item, index, navigation }) {
  const anim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 130),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.cardWrap, { opacity: anim, transform: [{ translateY }] }]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigation.navigate('WebView', { url: item.url, title: item.name, color: item.color })}
        style={styles.cardTouch}
      >
        {/* Glow border */}
        <View style={[styles.card, { borderColor: item.color + '35' }]}>
          {/* Top accent line */}
          <LinearGradient
            colors={[item.color, item.color + '00']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.topAccent}
          />

          <View style={styles.cardRow}>
            {/* Icon bubble */}
            <LinearGradient
              colors={[item.color + '30', item.color + '10']}
              style={[styles.iconBubble, { shadowColor: item.color }]}
            >
              <Text style={{ fontSize: 32 }}>{item.icon}</Text>
            </LinearGradient>

            <View style={styles.cardMeta}>
              <View style={[styles.badge, { backgroundColor: item.color + '20', borderColor: item.color + '50' }]}>
                <Text style={[Typography.label, { color: item.color, fontSize: 9 }]}>{item.badge}</Text>
              </View>
              <Text style={[Typography.h3, { color: Colors.textPrimary, marginTop: 6 }]}>{item.name}</Text>
              <Text style={[Typography.label, { color: item.color, marginTop: 2 }]}>{item.tagline}</Text>
            </View>
          </View>

          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 14, lineHeight: 24 }]}>
            {item.desc}
          </Text>

          {/* CTA row */}
          <View style={[styles.launchRow, { borderTopColor: item.color + '25' }]}>
            <Text style={[Typography.label, { color: item.color }]}>Open Tool</Text>
            <LinearGradient
              colors={[item.color + '30', item.color + '10']}
              style={styles.launchArrow}
            >
              <Text style={{ color: item.color, fontSize: 16 }}>→</Text>
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ToolsScreen({ navigation }) {
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <VideoBackground source={require('../../assets/videos/services.mp4')} />

      <ScreenWrapper style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          <Animated.View style={[styles.header, {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }]}>
            <Text style={styles.sectionLabel}>POWERED BY WETHINK</Text>
            <Text style={[Typography.h1, { color: Colors.textPrimary }]}>Smart Tools</Text>
            <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8, lineHeight: 26 }]}>
              AI-powered tools and business solutions — all in one place, built for your success.
            </Text>
          </Animated.View>

          {TOOLS.map((item, i) => (
            <ToolCard key={i} item={item} index={i} navigation={navigation} />
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 28 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },
  cardWrap: { marginBottom: 16 },
  cardTouch: { borderRadius: 20, overflow: 'hidden' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
  },
  topAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconBubble: {
    width: 72, height: 72, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  cardMeta: { flex: 1, marginLeft: 16, paddingTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  launchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 16, paddingTop: 14, borderTopWidth: 1,
  },
  launchArrow: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
});
