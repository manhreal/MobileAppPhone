import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from '../types';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../store/useAuthStore';

import LoginScreen from '../screens/LoginScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { HomeStack } from './HomeStack';

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: Colors.border },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
          Home: 'home',
          Orders: 'receipt-long',
          Profile: 'person',
        };
        return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Trang chủ' }} />
    <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Đơn của tôi' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản' }} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
