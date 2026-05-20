import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import { AppProvider, useTheme } from './src/context/AppContext';
import { Typography } from './src/theme/typography';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',      key: 'home',      icon: '🏠' },
  { name: 'Services',  key: 'services',  icon: '⚡' },
  { name: 'Portfolio', key: 'portfolio', icon: '🎨' },
  { name: 'Tools',     key: 'tools',     icon: '🤖' },
  { name: 'Contact',   key: 'contact',   icon: '📞' },
  { name: 'Settings',  key: 'settings',  icon: '⚙️' },
];

const TAB_SCREENS = {
  Home: HomeScreen,
  Services: ServicesScreen,
  Portfolio: PortfolioScreen,
  Tools: ToolsScreen,
  Contact: ContactScreen,
  Settings: SettingsScreen,
};

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, t } = useTheme();

  const currentRoute = state.routes[state.index]?.name;
  if (currentRoute === 'WebView') return null;

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <LinearGradient
        colors={colors.tabBarGradient}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.tabBarInner}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {isFocused && (
                <LinearGradient
                  colors={['rgba(0,212,170,0.18)', 'rgba(124,58,237,0.18)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Text style={{ fontSize: 16 }}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color: isFocused ? colors.teal : colors.textMuted }]}>
                {t(tab.key)}
              </Text>
              {isFocused && <View style={[styles.activeDot, { backgroundColor: colors.teal }]} />}
            </TouchableOpacity>
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
  tabBarOuter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingTop: 8,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    height: 64,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 1,
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 4, height: 4, borderRadius: 2,
    marginTop: 2,
  },
});
