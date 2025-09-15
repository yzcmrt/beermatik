// Beermatik - Ana Uygulama

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NotificationService } from './src/services/NotificationService';
import { StorageService } from './src/services/StorageService';

export default function App() {
  useEffect(() => {
    // Uygulama başlatıldığında servisleri initialize et
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      // Storage servisini başlat
      const storageService = StorageService.getInstance();
      await storageService.loadSession();

      // Notification servisini başlat
      const notificationService = NotificationService.getInstance();
      await notificationService.startNotificationSystem();
    } catch (error) {
      console.error('Servis başlatma hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppNavigator />
      <StatusBar style="light" backgroundColor="#000000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
