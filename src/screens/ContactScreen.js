import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, StatusBar,
  TouchableOpacity, TextInput, Linking, Alert, Keyboard, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import PulseRing from '../components/PulseRing';
import VideoBackground from '../components/VideoBackground';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icons';
import { PastelBackground } from '../components/PastelKit';
import { useTheme } from '../context/AppContext';

const PHONE = '0503125078';
const WHATSAPP_NUMBER = '971503125078';

function ContactButton({ item, index }) {
  const { colors } = useTheme();
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
            <Icon name={item.icon} size={22} color={item.color} strokeWidth={1.8} />
          </PulseRing>
          <View style={styles.contactInfo}>
            <Text style={[Typography.label, { color: item.color }]}>{item.label}</Text>
            <Text style={[Typography.body, { color: colors.textPrimary, marginTop: 2 }]}>{item.value}</Text>
          </View>
          <View style={[styles.arrowButton, { backgroundColor: item.color + '25', borderColor: item.color + '50' }]}>
            <Icon name="arrowRight" size={15} color={item.color} strokeWidth={2} />
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default function ContactScreen() {
  const { colors, t, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const ceoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const CONTACT_METHODS = [
    { icon: 'messageCircle', label: t('contactWhatsapp'), value: PHONE, color: '#25D366', glow: 'rgba(37,211,102,0.4)', action: () => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`) },
    { icon: 'phone', label: t('contactCall'), value: PHONE, color: colors.blue, glow: colors.glowBlue, action: () => Linking.openURL(`tel:${PHONE}`) },
    { icon: 'mail', label: t('contactEmail'), value: 'Info@wethink.ae', color: colors.teal, glow: colors.glowTeal, action: () => Linking.openURL('mailto:Info@wethink.ae') },
    { icon: 'globe', label: t('contactWebsite'), value: 'www.wethink.ae', color: colors.purple, glow: colors.glowPurple, action: () => Linking.openURL('https://www.wethink.ae') },
    { icon: 'camera', label: t('contactInstagram'), value: '@wethink.ae', color: '#E1306C', glow: 'rgba(225,48,108,0.4)', action: () => Linking.openURL('https://www.instagram.com/wethink.ae') },
    { icon: 'briefcase', label: t('contactLinkedIn'), value: 'Rasha Aljalam', color: '#0A66C2', glow: 'rgba(10,102,194,0.4)', action: () => Linking.openURL('https://www.linkedin.com/in/rasha-aljalam') },
  ];

  useEffect(() => {
    Animated.stagger(180, [
      Animated.spring(headerAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(ceoAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(formAnim, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert(t('missingInfo'), t('fillFields'));
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="transparent" translucent />
      {isDark
        ? <VideoBackground source={require('../../assets/videos/contact.mp4')} lightMode={false} />
        : <PastelBackground height={520} />}

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
          <Text style={[styles.sectionLabel, { color: colors.teal }]}>{t('getInTouch')}</Text>
          <Text style={[Typography.h1, { color: colors.textPrimary }]}>{t('contactTitle')}</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
            {t('contactSub')}
          </Text>
        </Animated.View>

        {/* CEO Profile */}
        <Animated.View style={[{
          opacity: ceoAnim,
          transform: [{ scale: ceoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
          marginBottom: 20,
        }]}>
          <GlassCard glowColor={colors.glowPurple}>
            <View style={styles.ceoRow}>
              <View style={[styles.ceoImageWrapper, { borderColor: colors.glowPurple }]}>
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
                <View style={[styles.ceoBadge, { backgroundColor: colors.glowPurple, borderColor: colors.purple + '50' }]}>
                  <Text style={[Typography.label, { color: colors.purple, fontSize: 9 }]}>{t('ceoRole')}</Text>
                </View>
                <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: 8 }]}>
                  Rasha{'\n'}Aljalam
                </Text>
                <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 6, lineHeight: 18 }]}>
                  {t('ceoItLine')}
                </Text>
                <TouchableOpacity
                  style={styles.linkedinBtn}
                  onPress={() => Linking.openURL('https://www.linkedin.com/in/rasha-aljalam')}
                  activeOpacity={0.8}
                >
                  <Icon name="briefcase" size={12} color="#0A66C2" strokeWidth={2} />
                  <Text style={[Typography.label, { color: '#0A66C2', fontSize: 9, marginLeft: 4 }]}>{t('ceoLinkedIn')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address */}
            <View style={[styles.addressRow, { borderTopColor: colors.border }]}>
              <Icon name="pin" size={16} color={colors.teal} strokeWidth={1.8} />
              <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginLeft: 10, flex: 1 }]}>
                {t('addressLine')}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Contact Methods */}
        {CONTACT_METHODS.map((item, i) => <ContactButton key={i} item={item} index={i} />)}

        {/* Inquiry Form */}
        <Animated.View style={[styles.formSection, {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: formAnim,
          transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }]}>
          <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: 20 }]}>
            {t('sendInquiry')}
          </Text>

          {submitted ? (
            <Animated.View style={[styles.successBox, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
              <Icon name="check" size={52} gradient={['#8B5CF6', '#06B6D4']} strokeWidth={2.2} />
              <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: 16, textAlign: 'center' }]}>
                {t('messageSent')}
              </Text>
              <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
                {t('replyNote')}
              </Text>
            </Animated.View>
          ) : (
            <View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('yourName')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
                  placeholder={t('namePlaceholder')}
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  selectionColor={colors.teal}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('emailAddress')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
                  placeholder={t('emailPlaceholder')}
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor={colors.teal}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('yourMessage')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
                  placeholder={t('messagePlaceholder')}
                  placeholderTextColor={colors.textMuted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  selectionColor={colors.teal}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={styles.submitButton}>
                <LinearGradient
                  colors={['#8B5CF6', '#6366F1', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={[Typography.button, { color: '#fff' }]}>{t('sendMessage')}</Text>
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
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 70, paddingBottom: 20 },
  header: { marginBottom: 20 },
  sectionLabel: { ...Typography.label, marginBottom: 8 },
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
  },
  ceoImage: { width: '100%', height: '100%' },
  ceoInfo: { flex: 1, marginLeft: 16, paddingTop: 4 },
  ceoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
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
    paddingTop: 14,
  },
  formSection: {
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { ...Typography.label, marginBottom: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    ...Typography.body,
  },
  textArea: { minHeight: 110, paddingTop: 14 },
  submitButton: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
  successBox: { alignItems: 'center', paddingVertical: 30 },
});
