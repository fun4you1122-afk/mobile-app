import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, StatusBar,
  TouchableOpacity, TextInput, Linking, Alert, Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import PulseRing from '../components/PulseRing';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import ParticleField from '../components/ParticleField';

const CONTACT_METHODS = [
  {
    icon: '💬',
    label: 'WhatsApp',
    value: 'Chat with us now',
    color: Colors.success,
    glow: 'rgba(34,197,94,0.4)',
    action: () => Linking.openURL('https://wa.me/971501234567'),
  },
  {
    icon: '📧',
    label: 'Email',
    value: 'info@wethink.ae',
    color: Colors.teal,
    glow: Colors.glowTeal,
    action: () => Linking.openURL('mailto:info@wethink.ae'),
  },
  {
    icon: '📞',
    label: 'Call Us',
    value: '+971 50 123 4567',
    color: Colors.blue,
    glow: Colors.glowBlue,
    action: () => Linking.openURL('tel:+971501234567'),
  },
  {
    icon: '🌐',
    label: 'Website',
    value: 'www.wethink.ae',
    color: Colors.purple,
    glow: Colors.glowPurple,
    action: () => Linking.openURL('https://www.wethink.ae'),
  },
];

function ContactButton({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200 + index * 120),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }], marginBottom: 12 }}>
      <GlassCard onPress={item.action} glowColor={item.glow}>
        <View style={styles.contactRow}>
          <PulseRing color={item.glow} size={52}>
            <Text style={{ fontSize: 22 }}>{item.icon}</Text>
          </PulseRing>
          <View style={styles.contactInfo}>
            <Text style={[Typography.label, { color: item.color }]}>{item.label}</Text>
            <Text style={[Typography.body, { color: Colors.textPrimary, marginTop: 2 }]}>{item.value}</Text>
          </View>
          <LinearGradient
            colors={[item.color, item.color + '80']}
            style={styles.arrowButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={{ color: Colors.white, fontSize: 16 }}>→</Text>
          </LinearGradient>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(formAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    Keyboard.dismiss();
    setSubmitted(true);
    Animated.parallel([
      Animated.spring(successScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(successOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#050815', '#080d1c']} style={StyleSheet.absoluteFill} />
      <AnimatedGradientBackground />
      <ParticleField />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <Text style={styles.sectionLabel}>GET IN TOUCH</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary }]}>Let's Talk</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>
            Ready to build something great? We'd love to hear from you.
          </Text>
        </Animated.View>

        {/* Contact Methods */}
        {CONTACT_METHODS.map((item, i) => <ContactButton key={i} item={item} index={i} />)}

        {/* Inquiry Form */}
        <Animated.View style={[styles.formSection, {
          opacity: formAnim,
          transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }]}>
          <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 20 }]}>
            Send an Inquiry
          </Text>

          {submitted ? (
            <Animated.View style={[styles.successBox, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
              <Text style={{ fontSize: 48 }}>✅</Text>
              <Text style={[Typography.h3, { color: Colors.textPrimary, marginTop: 16, textAlign: 'center' }]}>
                Message Sent!
              </Text>
              <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
                We'll get back to you within 24 hours.
              </Text>
            </Animated.View>
          ) : (
            <View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Smith"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  selectionColor={Colors.teal}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@company.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor={Colors.teal}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Your Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us about your project..."
                  placeholderTextColor={Colors.textMuted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  selectionColor={Colors.teal}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={styles.submitButton}>
                <LinearGradient
                  colors={['#00D4AA', '#3B5BDB', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={[Typography.button, { color: Colors.white }]}>Send Message →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 70 },
  header: { marginBottom: 24 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 16 },
  arrowButton: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  formSection: {
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    color: Colors.textPrimary,
    ...Typography.body,
  },
  textArea: { minHeight: 110, paddingTop: 14 },
  submitButton: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
  successBox: { alignItems: 'center', paddingVertical: 30 },
});
