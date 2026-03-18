import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '../types';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import DeviceModelScreen from '../screens/DeviceModelScreen';
import ScanIssueScreen from '../screens/ScanIssueScreen';
import ServiceFormScreen from '../screens/ServiceFormScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.primary },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ title: 'FOXY' }}
    />
    <Stack.Screen
      name="DeviceModel"
      component={DeviceModelScreen}
      options={({ route }) => ({ title: route.params.deviceName })}
    />
    <Stack.Screen
      name="ScanIssue"
      component={ScanIssueScreen}
      options={{ title: 'Chọn lỗi máy' }}
    />
    <Stack.Screen
      name="ServiceForm"
      component={ServiceFormScreen}
      options={{ title: 'Thông tin đặt dịch vụ' }}
    />
    <Stack.Screen
      name="OrderSummary"
      component={OrderSummaryScreen}
      options={{ title: 'Xác nhận đơn', headerLeft: () => null }}
    />
  </Stack.Navigator>
);
