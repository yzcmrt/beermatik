// Beermatik - Yaş Doğrulama ve Alkol Uyarısı Ekranı

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { triggerMediumHaptic } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/AppNavigator';

type AgeVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AgeVerification'>;

const { width, height } = Dimensions.get('window');

export const AgeVerificationScreen: React.FC = () => {
  const navigation = useNavigation<AgeVerificationScreenNavigationProp>();
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadWarnings, setHasReadWarnings] = useState(false);

  const handleAccept = async () => {
    if (!hasReadTerms || !hasReadWarnings) {
      Alert.alert(
        'Eksik Bilgi',
        'Lütfen tüm uyarıları okuyun ve onaylayın.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    try {
      await triggerMediumHaptic();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Haptic feedback hatası:', error);
      navigation.navigate('Home');
    }
  };

  const handleDecline = async () => {
    try {
      await triggerMediumHaptic();
      Alert.alert(
        'Uygulama Kapatılacak',
        '18 yaşından küçük bireyler bu uygulamayı kullanamaz. Uygulama kapatılacaktır.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Uygulamayı kapat (Expo'da bu mümkün değil, sadece alert göster)
              console.log('Uygulama kapatılması gerekiyor');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Haptic feedback hatası:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo ve Başlık */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍺</Text>
          <Text style={styles.appName}>Beermatik</Text>
          <Text style={styles.tagline}>Bira Tüketim Takip Uygulaması</Text>
        </View>

        {/* Yaş Uyarısı */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ YAŞ SINIRLAMASI</Text>
          <Text style={styles.warningText}>
            Bu uygulama 18 yaş altı bireyler için uygun değildir.
          </Text>
          <Text style={styles.ageQuestion}>
            18 yaşından büyük müsünüz?
          </Text>
        </View>

        {/* Alkol Uyarıları */}
        <View style={styles.warningsCard}>
          <Text style={styles.warningsTitle}>🍺 SORUMLU İÇKİ İÇME</Text>
          
          <View style={styles.warningItem}>
            <Text style={styles.warningIcon}>🚗</Text>
            <Text style={styles.warningItemText}>
              Araç kullanırken alkol tüketmeyin
            </Text>
          </View>

          <View style={styles.warningItem}>
            <Text style={styles.warningIcon}>🤰</Text>
            <Text style={styles.warningItemText}>
              Hamilelik döneminde alkol tüketimi önerilmez
            </Text>
          </View>

          <View style={styles.warningItem}>
            <Text style={styles.warningIcon}>💊</Text>
            <Text style={styles.warningItemText}>
              İlaç kullanırken doktorunuza danışın
            </Text>
          </View>

          <View style={styles.warningItem}>
            <Text style={styles.warningIcon}>❤️</Text>
            <Text style={styles.warningItemText}>
              Sağlık sorunlarınız varsa dikkatli olun
            </Text>
          </View>

          <View style={styles.warningItem}>
            <Text style={styles.warningIcon}>⚖️</Text>
            <Text style={styles.warningItemText}>
              Yasal sınırlara uyun
            </Text>
          </View>
        </View>

        {/* Yasal Uyarı */}
        <View style={styles.legalCard}>
          <Text style={styles.legalTitle}>📋 YASAL UYARI</Text>
          <Text style={styles.legalText}>
            Beermatik yalnızca bir takip aracıdır ve tıbbi tavsiye niteliği taşımaz. 
            Aşırı alkol tüketimi sağlığa zararlıdır. Sorumlu tüketim önerilir.
          </Text>
        </View>

        {/* Onay Kutuları */}
        <View style={styles.checkboxes}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => {
              setHasReadTerms(!hasReadTerms);
              triggerMediumHaptic();
            }}
          >
            <View style={[styles.checkbox, hasReadTerms && styles.checkboxChecked]}>
              {hasReadTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              Yaş sınırlaması ve alkol uyarılarını okudum
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => {
              setHasReadWarnings(!hasReadWarnings);
              triggerMediumHaptic();
            }}
          >
            <View style={[styles.checkbox, hasReadWarnings && styles.checkboxChecked]}>
              {hasReadWarnings && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              Sorumlu içki içme kurallarını kabul ediyorum
            </Text>
          </TouchableOpacity>
        </View>

        {/* Butonlar */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
            activeOpacity={0.8}
          >
            <Text style={styles.declineButtonText}>18 Yaşından Küçüğüm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              (!hasReadTerms || !hasReadWarnings) && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!hasReadTerms || !hasReadWarnings}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.acceptButtonText,
              (!hasReadTerms || !hasReadWarnings) && styles.acceptButtonTextDisabled
            ]}>
              18 Yaşından Büyüğüm - Devam Et
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alt Bilgi */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Daha fazla bilgi için: 
            {'\n'}
            <Text style={styles.linkText}>beermatik.vercel.app</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 30,
  },
  
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  
  tagline: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  
  warningCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  warningText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  
  ageQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
  
  warningsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  
  warningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  
  warningIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  
  warningItemText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  
  legalCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  
  legalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  legalText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  checkboxes: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  checkboxChecked: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  
  checkmark: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  
  buttons: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  
  declineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  
  declineButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  acceptButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  
  acceptButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  
  acceptButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  acceptButtonTextDisabled: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  linkText: {
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
});
