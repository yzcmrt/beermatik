// Beermatik - Ana Ekran

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BeerCounter } from '../components/BeerCounter';
import { SizeSelector } from '../components/SizeSelector';
import { ResetButton } from '../components/ResetButton';
import { NotificationManager } from '../components/NotificationManager';
import { ResponsibleDrinkingWarning } from '../components/ResponsibleDrinkingWarning';
import { StorageService, BeerSession } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';
import { calculateVolume } from '../utils/helpers';
import { BEER_SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<HomeScreenRouteProp>();
  const [session, setSession] = useState<BeerSession>({
    beerCount: 0,
    totalVolume: 0,
    sessionStartTime: Date.now(),
    lastBeerTime: 0,
    selectedSize: '33cl',
    notificationEnabled: false,
    beerEntries: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const storageService = StorageService.getInstance();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    loadSessionData();
  }, []);

  // Route parametrelerini dinle (ayarlardan veri temizleme sonrası)
  useEffect(() => {
    if (route.params?.refreshData) {
      loadSessionData();
      // Parametreyi temizle
      navigation.setParams({ refreshData: undefined });
    }
  }, [route.params]);

  const loadSessionData = async () => {
    try {
      setIsLoading(true);
      const sessionData = await storageService.loadSession();
      setSession(sessionData);
    } catch (error) {
      console.error('Oturum verisi yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeerAdd = useCallback(async () => {
    try {
      const selectedBeerSize = BEER_SIZES.find(size => size.id === session.selectedSize);
      if (!selectedBeerSize) return;

      // Yeni bira ekle
      await storageService.addBeer(session.selectedSize, selectedBeerSize.volume);

      // Yerel state'i güncelle
      const updatedSession = await storageService.loadSession();
      setSession(updatedSession);

      // Bildirim sistemini güncelle
      await notificationService.onBeerAdded();
    } catch (error) {
      console.error('Bira ekleme hatası:', error);
    }
  }, [session.selectedSize, storageService, notificationService]);

  const handleSizeChange = useCallback(async (newSize: string) => {
    try {
      await storageService.updateSelectedSize(newSize);

      setSession(prev => ({
        ...prev,
        selectedSize: newSize,
      }));
    } catch (error) {
      console.error('Boyut değiştirme hatası:', error);
    }
  }, [storageService]);

  const handleReset = useCallback(async () => {
    try {
      await storageService.startNewSession();
      await notificationService.stopNotificationSystem();
      
      const updatedSession = await storageService.loadSession();
      setSession(updatedSession);
    } catch (error) {
      console.error('Reset hatası:', error);
    }
  }, [storageService, notificationService]);

  const handleNotificationToggle = useCallback(async (enabled: boolean) => {
    try {
      // Storage'a kaydet
      await storageService.updateNotificationEnabled(enabled);
      
      // Local state'i güncelle
      setSession(prev => ({
        ...prev,
        notificationEnabled: enabled,
      }));
      
      // Notification service'i güncelle
      await notificationService.updateNotificationSettings(enabled);
    } catch (error) {
      console.error('Bildirim ayarı güncelleme hatası:', error);
    }
  }, [storageService, notificationService]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSessionData();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={globalStyles.centerContainer}>
          <Text style={globalStyles.title}>Beermatik</Text>
          <Text style={globalStyles.subtitle}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {/* Başlık */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={globalStyles.title}>Beermatik</Text>
              <Text style={globalStyles.subtitle}>Bira Sayacı</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings' as never)}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ana Sayaç */}
        <BeerCounter
          beerCount={session.beerCount}
          totalVolume={session.totalVolume}
          selectedSize={session.selectedSize}
          sessionStartTime={session.sessionStartTime}
          onBeerAdd={handleBeerAdd}
        />

        {/* Boyut Seçici */}
        <SizeSelector
          selectedSize={session.selectedSize}
          onSizeChange={handleSizeChange}
        />

        {/* Bildirim Yöneticisi */}
        <NotificationManager
          onNotificationToggle={handleNotificationToggle}
          initialNotificationEnabled={session.notificationEnabled}
        />

        {/* Sıfırlama Butonu */}
        <ResetButton
          onReset={handleReset}
          disabled={session.beerCount === 0}
        />

        {/* Alt Bilgi */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Beermatik ile bira tüketimini takip et! 🍺
          </Text>
          <Text style={styles.responsibleText}>
            Sorumlu içki içme önemlidir 🍺
          </Text>
        </View>
      </ScrollView>

      {/* Sorumlu İçki İçme Uyarıları */}
      <ResponsibleDrinkingWarning
        beerCount={session.beerCount}
        showAfterBeerCount={3}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  settingsButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  
  settingsButtonText: {
    fontSize: 20,
  },
  
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  
  footerText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  
  responsibleText: {
    fontSize: 12,
    color: '#FFA500',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
