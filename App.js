import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';
import { Colors } from './src/theme/colors';
import { Typography } from './src/theme/typography';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠',
  Services: '⚡',
  Portfolio: '🎨',
  About: '📖',
  Contact: '📞',
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={tabStyles.wrapper}>
      <LinearGradient
        colors={['rgba(5,8,21,0)', 'rgba(5,8,21,0.97)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={tabStyles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={tabStyles.tabItem}
              activeOpacity={0.75}
            >
              {isFocused && (
                <LinearGradient
                  colors={['rgba(0,212,170,0.15)', 'rgba(124,58,237,0.15)']}
                  style={tabStyles.activeBg}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              )}
              <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>
              <Text style={[tabStyles.tabLabel, { color: isFocused ? Colors.teal : Colors.textMuted }]}>
                {route.name}
              </Text>
              {isFocused && <View style={tabStyles.dot} />}
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
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
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const tabStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 24,
    paddingTop: 30,
  },
  bar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 56,
    position: 'relative',
  },
  activeBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.2)',
  },
  tabLabel: {
    ...Typography.label,
    fontSize: 9,
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.teal,
    marginTop: 4,
  },
});
