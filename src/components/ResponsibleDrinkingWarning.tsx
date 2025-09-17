// Beermatik - Sorumlu İçki İçme Uyarıları Komponenti

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { triggerMediumHaptic } from '../utils/helpers';

interface ResponsibleDrinkingWarningProps {
  beerCount: number;
  showAfterBeerCount?: number;
}

export const ResponsibleDrinkingWarning: React.FC<ResponsibleDrinkingWarningProps> = ({
  beerCount,
  showAfterBeerCount = 3,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWarning, setCurrentWarning] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const warnings = [
    {
      icon: '🚗',
      title: 'Araç Kullanmayın',
      message: 'Alkol aldıktan sonra araç kullanmak tehlikelidir. Lütfen toplu taşıma kullanın veya bir arkadaşınızdan yardım isteyin.',
    },
    {
      icon: '💧',
      title: 'Su İçin',
      message: 'Her bira için bir bardak su içmeyi unutmayın. Hidrasyon sağlığınız için önemlidir.',
    },
    {
      icon: '🍕',
      title: 'Yemek Yiyin',
      message: 'Alkol alırken yemek yemeyi unutmayın. Boş mideyle içmek daha hızlı etkilenmenize neden olur.',
    },
    {
      icon: '⏰',
      title: 'Zaman Tanıyın',
      message: 'Bira arasında en az 1 saat bekleyin. Vücudunuzun alkolü işlemesi için zaman tanıyın.',
    },
    {
      icon: '👥',
      title: 'Arkadaşlarınızla Kalın',
      message: 'Güvenliğiniz için arkadaşlarınızla birlikte kalın ve birbirinize göz kulak olun.',
    },
    {
      icon: '🏠',
      title: 'Güvenli Eve Dönüş',
      message: 'Eve güvenli bir şekilde dönmeyi planlayın. Taksi, Uber veya toplu taşıma kullanın.',
    },
  ];

  useEffect(() => {
    if (beerCount === showAfterBeerCount) {
      setIsVisible(true);
      showWarning();
    }
  }, [beerCount, showAfterBeerCount]);

  const showWarning = () => {
    const warningIndex = Math.min(currentWarning, warnings.length - 1);
    setCurrentWarning(warningIndex);

    // Animasyon başlat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 5 saniye sonra gizle
    setTimeout(() => {
      hideWarning();
    }, 5000);
  };

  const hideWarning = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Sonraki uyarıya geç
      setCurrentWarning((prev) => (prev + 1) % warnings.length);
      // Overlay'i tamamen kapat ki dokunuşları engellemesin
      setIsVisible(false);
    });
  };

  const handleDismiss = async () => {
    try {
      await triggerMediumHaptic();
    } catch (error) {
      console.error('Haptic feedback hatası:', error);
    }
    hideWarning();
  };

  const handleShowNext = async () => {
    try {
      await triggerMediumHaptic();
    } catch (error) {
      console.error('Haptic feedback hatası:', error);
    }
    hideWarning();
  };

  if (!isVisible) return null;

  const warning = warnings[currentWarning];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <View style={styles.warningCard}>
        <View style={styles.header}>
          <Text style={styles.icon}>{warning.icon}</Text>
          <Text style={styles.title}>{warning.title}</Text>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.message}>{warning.message}</Text>

        <View style={styles.footer}>
          <Text style={styles.responsibleText}>
            🍺 Sorumlu İçki İçme Önemlidir
          </Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleShowNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Sonraki İpucu</Text>
          </TouchableOpacity>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {warnings.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentWarning && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  warningCard: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    maxWidth: 350,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  icon: {
    fontSize: 32,
    marginRight: 15,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  dismissButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dismissText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  responsibleText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  nextButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  nextButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },

  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },

  progressDotActive: {
    backgroundColor: '#FFD700',
  },
});
