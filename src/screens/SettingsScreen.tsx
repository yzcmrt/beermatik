// Beermatik - Ayarlar Ekranı

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { StorageService } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';
import { globalStyles } from '../styles/globalStyles';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [settings, setSettings] = useState({
    notificationEnabled: false,
    hapticEnabled: true,
    autoReset: false,
    theme: 'dark',
  });

  const storageService = StorageService.getInstance();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const session = await storageService.loadSession();
      setSettings(prev => ({
        ...prev,
        notificationEnabled: session.notificationEnabled,
      }));
    } catch (error) {
      console.error('Ayarlar yükleme hatası:', error);
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      await notificationService.updateNotificationSettings(enabled);
      setSettings(prev => ({ ...prev, notificationEnabled: enabled }));
      
      Alert.alert(
        enabled ? 'Bildirimler Açıldı' : 'Bildirimler Kapatıldı',
        enabled 
          ? 'Artık bira hatırlatma bildirimleri alacaksınız! 🍺'
          : 'Bildirimler kapatıldı.',
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      console.error('Bildirim ayarı hatası:', error);
      Alert.alert('Hata', 'Ayar güncellenirken bir hata oluştu.');
    }
  };

  const handleHapticToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, hapticEnabled: enabled }));
    // Haptic ayarı için local storage kullanılabilir
  };

  const handleAutoResetToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, autoReset: enabled }));
    // Otomatik reset ayarı için local storage kullanılabilir
  };

  const handleTestNotification = async () => {
    try {
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

  const handleClearData = () => {
    Alert.alert(
      'Verileri Temizle',
      'Tüm veriler silinecek. Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              // Tüm verileri temizle
              await storageService.clearAllData();
              await notificationService.stopNotificationSystem();
              
              // Ana ekrana geri dön ve refresh et
              navigation.navigate('Home', { refreshData: true });
              
              Alert.alert(
                'Başarılı', 
                'Tüm veriler silindi. Ana ekrana yönlendiriliyorsunuz.',
                [{ text: 'Tamam' }]
              );
            } catch (error) {
              console.error('Veri temizleme hatası:', error);
              Alert.alert('Hata', 'Veriler silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({ 
    title, 
    description, 
    value, 
    onToggle, 
    type = 'switch' 
  }: {
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#FFD700' }}
          thumbColor={value ? '#000000' : '#f4f3f4'}
        />
      ) : (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onToggle(true)}
        >
          <Text style={styles.actionButtonText}>Test Et</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Ayarlar</Text>
          <Text style={globalStyles.subtitle}>Uygulama Tercihleri</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          <SettingRow
            title="Hatırlatma Bildirimleri"
            description="Bira içmeyi unutmamanız için hatırlatma bildirimleri"
            value={settings.notificationEnabled}
            onToggle={handleNotificationToggle}
          />

          <SettingRow
            title="Test Bildirimi"
            description="Bildirim sistemini test etmek için"
            value={false}
            onToggle={handleTestNotification}
            type="button"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel</Text>
          
          <SettingRow
            title="Haptic Feedback"
            description="Dokunsal geri bildirimler (titreşim)"
            value={settings.hapticEnabled}
            onToggle={handleHapticToggle}
          />

          <SettingRow
            title="Otomatik Reset"
            description="Günlük otomatik sayaç sıfırlama"
            value={settings.autoReset}
            onToggle={handleAutoResetToggle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Tüm Verileri Sil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Beermatik v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 Beermatik Team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  
  settingDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  
  actionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  
  actionButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  dangerButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  
  footerText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 5,
  },
});
