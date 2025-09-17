// Beermatik - Bira Sayacı Komponenti

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Easing,
} from 'react-native';
import { triggerMediumHaptic } from '../utils/helpers';
import { BEER_SIZES } from '../utils/constants';
import { calculateVolume, formatNumber, getElapsedTime } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';

interface BeerCounterProps {
  beerCount: number;
  totalVolume: number;
  selectedSize: string;
  sessionStartTime: number;
  onBeerAdd: () => void;
}

export const BeerCounter: React.FC<BeerCounterProps> = ({
  beerCount,
  totalVolume,
  selectedSize,
  sessionStartTime,
  onBeerAdd,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const previousBeerCount = useRef(beerCount);

  const selectedBeerSize = BEER_SIZES.find(size => size.id === selectedSize);
  const elapsedTime = getElapsedTime(sessionStartTime);

  // Bira sayısı değiştiğinde animasyon çalıştır
  useEffect(() => {
    if (beerCount > previousBeerCount.current) {
      runCounterAnimation();
    }
    previousBeerCount.current = beerCount;
  }, [beerCount]);

  const runCounterAnimation = () => {
    // Bounce animasyonu
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Rotate animasyonu
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Pulse animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start();
  };

  const handleBeerAdd = async () => {
    try {
      // Haptic feedback
      await triggerMediumHaptic();
      
      // Vibration (Android)
      Vibration.vibrate(100);

      // Buton animasyonu
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      // Fade animasyonu
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      onBeerAdd();
    } catch (error) {
      console.error('Bira ekleme hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ana Bira İkonu */}
      <Animated.View 
        style={[
          styles.beerIconContainer, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: pulseAnim },
              { 
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }
            ]
          }
        ]}
      >
        <Text style={styles.beerIcon}>🍺</Text>
      </Animated.View>

      {/* Sayaç */}
      <Animated.View 
        style={[
          styles.counterContainer, 
          { 
            transform: [
              { scale: bounceAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.counterText}>{formatNumber(beerCount)}</Text>
        <Text style={styles.counterLabel}>Bira</Text>
      </Animated.View>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalVolume}cl</Text>
          <Text style={styles.statLabel}>Toplam Hacim</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{elapsedTime}</Text>
          <Text style={styles.statLabel}>Geçen Süre</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{selectedBeerSize?.label}</Text>
          <Text style={styles.statLabel}>Boyut</Text>
        </View>
      </View>

      {/* Bira Ekleme Butonu */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleBeerAdd}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Motivasyon Mesajları */}
      {beerCount > 0 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {beerCount === 1 && "İlk bira! 🍺"}
            {beerCount === 2 && "İkinci bira! 🍻"}
            {beerCount === 3 && "Üçüncü bira! 🍺"}
            {beerCount === 4 && "Dördüncü bira! 🍻"}
            {beerCount === 5 && "Beşinci bira! 🍺"}
            {beerCount > 5 && "Devam et! 🍻"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  beerIconContainer: {
    marginBottom: 20,
  },
  
  beerIcon: {
    fontSize: 80,
    textAlign: 'center',
  },
  
  counterContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  counterText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  
  counterLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 5,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 5,
  },
  
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  
  addButton: {
    backgroundColor: '#FFD700',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  addButtonText: {
    color: '#000000',
    fontSize: 36,
    fontWeight: 'bold',
  },
  
  motivationContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  
  motivationText: {
    fontSize: 16,
    color: '#FFA500',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
