// Beermatik - Bildirim Yöneticisi Komponenti

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { triggerMediumHaptic } from '../utils/helpers';
import { NotificationService } from '../services/NotificationService';
import { StorageService } from '../services/StorageService';

interface NotificationManagerProps {
  onNotificationToggle?: (enabled: boolean) => void;
  initialNotificationEnabled?: boolean;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  onNotificationToggle,
  initialNotificationEnabled = false,
}) => {
  const [notificationEnabled, setNotificationEnabled] = useState(initialNotificationEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [nextNotificationTime, setNextNotificationTime] = useState<number | null>(null);

  const notificationService = NotificationService.getInstance();
  const storageService = StorageService.getInstance();

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  // Initial notification state'i güncelle
  useEffect(() => {
    setNotificationEnabled(initialNotificationEnabled);
  }, [initialNotificationEnabled]);

  const loadNotificationSettings = async () => {
    try {
      const session = await storageService.loadSession();
      setNotificationEnabled(session.notificationEnabled);
      
      const stats = notificationService.getNotificationStats();
      setNextNotificationTime(stats.nextNotificationTime);
    } catch (error) {
      console.error('Bildirim ayarları yükleme hatası:', error);
    }
  };

  const handleToggleNotification = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      await triggerMediumHaptic();
      
      await notificationService.updateNotificationSettings(enabled);
      setNotificationEnabled(enabled);
      
      if (enabled) {
        const stats = notificationService.getNotificationStats();
        setNextNotificationTime(stats.nextNotificationTime);
        Alert.alert(
          'Bildirimler Açıldı',
          'Beermatik artık sizi bira içmeye hatırlatacak! 🍺',
          [{ text: 'Tamam' }]
        );
      } else {
        setNextNotificationTime(null);
        Alert.alert(
          'Bildirimler Kapatıldı',
          'Artık hatırlatma bildirimleri almayacaksınız.',
          [{ text: 'Tamam' }]
        );
      }
      
      onNotificationToggle?.(enabled);
    } catch (error) {
      console.error('Bildirim ayarı güncelleme hatası:', error);
      Alert.alert('Hata', 'Bildirim ayarları güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await triggerMediumHaptic();
      await notificationService.sendTestNotification();
      Alert.alert(
        'Test Bildirimi',
        'Test bildirimi gönderildi! 2 saniye içinde gelecek.',
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      console.error('Test bildirimi hatası:', error);
      Alert.alert('Hata', 'Test bildirimi gönderilemedi.');
    }
  };

  const formatNextNotificationTime = (timestamp: number | null): string => {
    if (!timestamp) return 'Yok';
    
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Yakında';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}s ${minutes % 60}dk sonra`;
    }
    return `${minutes}dk sonra`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bildirim Ayarları</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Hatırlatma Bildirimleri</Text>
          <Text style={styles.settingDescription}>
            Bira içmeyi unutmamanız için hatırlatma bildirimleri alın
          </Text>
        </View>
        <Switch
          value={notificationEnabled}
          onValueChange={handleToggleNotification}
          disabled={isLoading}
          trackColor={{ false: '#767577', true: '#FFD700' }}
          thumbColor={notificationEnabled ? '#000000' : '#f4f3f4'}
        />
      </View>

      {notificationEnabled && (
        <View style={styles.notificationInfo}>
          <Text style={styles.infoLabel}>Sonraki Bildirim:</Text>
          <Text style={styles.infoValue}>
            {formatNextNotificationTime(nextNotificationTime)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.testButton}
        onPress={handleTestNotification}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.testButtonText}>Test Bildirimi Gönder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  
  settingDescription: {
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 16,
  },
  
  notificationInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  
  infoLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  
  testButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  
  testButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
