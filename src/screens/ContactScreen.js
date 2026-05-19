import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, StatusBar,
  TouchableOpacity, TextInput, Linking, Alert, Keyboard, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import PulseRing from '../components/PulseRing';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import ParticleField from '../components/ParticleField';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';

const PHONE = '0503125078';
const WHATSAPP_NUMBER = '971503125078';

const CONTACT_METHODS = [
  {
    icon: '💬',
    label: 'WhatsApp',
    value: PHONE,
    color: '#25D366',
    glow: 'rgba(37,211,102,0.4)',
    action: () => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`),
  },
  {
    icon: '📞',
    label: 'Call Us',
    value: PHONE,
    color: Colors.blue,
    glow: Colors.glowBlue,
    action: () => Linking.openURL(`tel:${PHONE}`),
  },
  {
    icon: '📧',
    label: 'Email',
    value: 'Info@wethink.ae',
    color: Colors.teal,
    glow: Colors.glowTeal,
    action: () => Linking.openURL('mailto:Info@wethink.ae'),
  },
  {
    icon: '🌐',
    label: 'Website',
    value: 'www.wethink.ae',
    color: Colors.purple,
    glow: Colors.glowPurple,
    action: () => Linking.openURL('https://www.wethink.ae'),
  },
  {
    icon: '📸',
    label: 'Instagram',
    value: '@wethink.ae',
    color: '#E1306C',
    glow: 'rgba(225,48,108,0.4)',
    action: () => Linking.openURL('https://www.instagram.com/wethink.ae'),
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'Rasha Aljalam',
    color: '#0A66C2',
    glow: 'rgba(10,102,194,0.4)',
    action: () => Linking.openURL('https://www.linkedin.com/in/rasha-aljalam'),
  },
];

function ContactButton({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200 + index * 100),
      Animated.parallel([
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }], marginBottom: 10 }}>
      <GlassCard onPress={item.action} glowColor={item.glow}>
        <View style={styles.contactRow}>
          <PulseRing color={item.glow} size={48}>
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
          </PulseRing>
          <View style={styles.contactInfo}>
            <Text style={[Typography.label, { color: item.color }]}>{item.label}</Text>
            <Text style={[Typography.body, { color: Colors.textPrimary, marginTop: 2 }]}>{item.value}</Text>
          </View>
          <View style={[styles.arrowButton, { backgroundColor: item.color + '25', borderColor: item.color + '50' }]}>
            <Text style={{ color: item.color, fontSize: 14 }}>→</Text>
          </View>
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
  const ceoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(ceoAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
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
      <VideoBackground source={require('../../assets/videos/contact.mp4')} />
      <AnimatedGradientBackground />
      <ParticleField />

      <ScreenWrapper style={{ flex: 1 }}>
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
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 6 }]}>
            Ready to build something great? We'd love to hear from you.
          </Text>
        </Animated.View>

        {/* CEO Profile */}
        <Animated.View style={[{
          opacity: ceoAnim,
          transform: [{ scale: ceoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
          marginBottom: 20,
        }]}>
          <GlassCard glowColor={Colors.glowPurple}>
            <View style={styles.ceoRow}>
              <View style={styles.ceoImageWrapper}>
                <Image
                  source={require('../../assets/images/ceo.jpg')}
                  style={styles.ceoImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(124,58,237,0.3)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </View>
              <View style={styles.ceoInfo}>
                <View style={styles.ceoBadge}>
                  <Text style={[Typography.label, { color: Colors.purple, fontSize: 9 }]}>CEO & FOUNDER</Text>
                </View>
                <Text style={[Typography.h3, { color: Colors.textPrimary, marginTop: 8 }]}>
                  Rasha{'\n'}Aljalam
                </Text>
                <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 6, lineHeight: 18 }]}>
                  IT Consulting &{'\n'}Digital Solutions
                </Text>
                <TouchableOpacity
                  style={styles.linkedinBtn}
                  onPress={() => Linking.openURL('https://www.linkedin.com/in/rasha-aljalam')}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 12 }}>💼</Text>
                  <Text style={[Typography.label, { color: '#0A66C2', fontSize: 9, marginLeft: 4 }]}>LinkedIn</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address */}
            <View style={styles.addressRow}>
              <Text style={{ fontSize: 16 }}>📍</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginLeft: 10, flex: 1 }]}>
                Pixel, Al Reem Island, Makers District, Abu Dhabi, UAE
              </Text>
            </View>
          </GlassCard>
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

        <View style={{ height: 120 }} />
      </ScrollView>
      </ScreenWrapper>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 20 },
  sectionLabel: { ...Typography.label, color: Colors.teal, marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 14 },
  arrowButton: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  ceoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  ceoImageWrapper: {
    width: 110, height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glowPurple,
  },
  ceoImage: { width: '100%', height: '100%' },
  ceoInfo: { flex: 1, marginLeft: 16, paddingTop: 4 },
  ceoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.glowPurple,
    borderWidth: 1,
    borderColor: Colors.purple + '50',
  },
  linkedinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(10,102,194,0.15)',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(10,102,194,0.3)',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 14,
  },
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
