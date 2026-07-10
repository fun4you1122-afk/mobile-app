import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import ContactScreen from './src/screens/ContactScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import Icon from './src/components/Icons';
import { AppProvider, useTheme } from './src/context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',      key: 'home',      icon: 'home' },
  { name: 'Services',  key: 'services',  icon: 'bolt' },
  { name: 'Portfolio', key: 'portfolio', icon: 'layers' },
  { name: 'Tools',     key: 'tools',     icon: 'sparkles' },
  { name: 'Contact',   key: 'contact',   icon: 'chat' },
  { name: 'Settings',  key: 'settings',  icon: 'settings' },
];

const TAB_SCREENS = {
  Home: HomeScreen,
  Services: ServicesScreen,
  Portfolio: PortfolioScreen,
  Tools: ToolsScreen,
  Contact: ContactScreen,
  Settings: SettingsScreen,
};

const BRAND = ['#8B5CF6', '#6366F1', '#EC4899'];

function TabItem({ tab, isFocused, onPress, colors, label }) {
  const focus = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(focus, {
      toValue: isFocused ? 1 : 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const iconScale = focus.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const iconLift = focus.interpolate({ inputRange: [0, 1], outputRange: [4, 0] });
  const haloScale = focus.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const labelSlide = focus.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem} activeOpacity={0.75}>
      <Animated.View style={{ alignItems: 'center', transform: [{ translateY: iconLift }] }}>
        <View style={styles.iconSlot}>
          {/* Gradient halo behind the active icon */}
          <Animated.View style={[styles.halo, { opacity: focus, transform: [{ scale: haloScale }] }]}>
            <LinearGradient
              colors={['rgba(139,92,246,0.22)', 'rgba(236,72,153,0.20)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.haloFill}
            />
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            {isFocused
              ? <Icon name={tab.icon} size={22} gradient={[BRAND[0], BRAND[2]]} strokeWidth={2} />
              : <Icon name={tab.icon} size={22} color={colors.textMuted} strokeWidth={1.8} />}
          </Animated.View>
        </View>
        <Animated.Text
          numberOfLines={1}
          style={[styles.tabLabel, {
            color: colors.accentPurple,
            opacity: focus,
            transform: [{ translateY: labelSlide }],
          }]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, t, isDark } = useTheme();

  const currentRoute = state.routes[state.index]?.name;
  if (currentRoute === 'WebView') return null;

  return (
    <View pointerEvents="box-none" style={[styles.dockWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.dock, {
        backgroundColor: isDark ? 'rgba(8,13,28,0.94)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)',
      }]}>
        {/* Top sheen line */}
        <LinearGradient
          colors={['rgba(139,92,246,0.5)', 'rgba(99,102,241,0.5)', 'rgba(236,72,153,0.5)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.dockAccent}
        />
        {TABS.map((tab) => {
          const routeIndex = state.routes.findIndex(r => r.name === tab.name);
          const isFocused = state.index === routeIndex;
          return (
            <TabItem
              key={tab.name}
              tab={tab}
              label={t(tab.key)}
              isFocused={isFocused}
              colors={colors}
              onPress={() => navigation.navigate(tab.name)}
            />
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={TAB_SCREENS[tab.name]} />
      ))}
      {/* WebView lives inside the Tab navigator so any tab screen can navigate to it */}
      <Tab.Screen name="WebView" component={WebViewScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  dockWrap: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 12,
  },
  dock: {
    flexDirection: 'row',
    borderRadius: 26,
    borderWidth: 1,
    height: 66,
    alignItems: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  dockAccent: {
    position: 'absolute',
    top: 0, left: 20, right: 20,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.65,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconSlot: {
    width: 38, height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
    overflow: 'hidden',
  },
  haloFill: { flex: 1 },
  tabLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 1,
  },
});
