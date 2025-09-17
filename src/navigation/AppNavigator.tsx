// Beermatik - Ana Navigasyon

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AgeVerificationScreen } from '../screens/AgeVerificationScreen';

export type RootStackParamList = {
  AgeVerification: undefined;
  Home: { refreshData?: boolean } | undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AgeVerification"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
            borderBottomWidth: 1,
            borderBottomColor: '#FFD700',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: '#000000',
          },
        }}
      >
        <Stack.Screen
          name="AgeVerification"
          component={AgeVerificationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Beermatik',
            headerShown: false, // Ana ekranda header gösterme
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Ayarlar',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
