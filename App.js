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
import WebViewScreen from './src/screens/WebViewScreen';
import { Colors } from './src/theme/colors';
import { Typography } from './src/theme/typography';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',      icon: '🏠' },
  { name: 'Services',  icon: '⚡' },
  { name: 'Portfolio', icon: '🎨' },
  { name: 'Tools',     icon: '🤖' },
  { name: 'Contact',   icon: '📞' },
];

const TAB_SCREENS = {
  Home: HomeScreen,
  Services: ServicesScreen,
  Portfolio: PortfolioScreen,
  Tools: ToolsScreen,
  Contact: ContactScreen,
};

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <LinearGradient
        colors={['rgba(5,8,21,0)', 'rgba(5,8,21,0.97)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.tabBarInner}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const isTools = tab.name === 'Tools';
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={[styles.tabItem, isTools && styles.tabItemTools]}
              activeOpacity={0.7}
            >
              {isFocused && !isTools && (
                <LinearGradient
                  colors={['rgba(0,212,170,0.18)', 'rgba(124,58,237,0.18)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              {isTools ? (
                <LinearGradient
                  colors={isFocused ? ['#00D4AA', '#7C3AED'] : ['rgba(0,212,170,0.3)', 'rgba(124,58,237,0.3)']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.toolsGradientBtn}
                >
                  <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, { color: '#fff', fontSize: 8 }]}>{tab.name}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, { color: isFocused ? Colors.teal : Colors.textMuted }]}>
                    {tab.name}
                  </Text>
                  {isFocused && <View style={styles.activeDot} />}
                </>
              )}
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
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="WebView" component={WebViewScreen} options={{ animation: 'slide_from_right' }} />
          </Stack.Navigator>
        </NavigationContainer>
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
    paddingHorizontal: 6,
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
    marginHorizontal: 2,
  },
  tabItemTools: {
    flex: 1.2,
  },
  toolsGradientBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.teal,
    marginTop: 3,
  },
});
