// Beermatik - Bira Boyutu Seçici Komponenti

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { BEER_SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSize,
  onSizeChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bira Boyutu</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {BEER_SIZES.map((size) => (
          <TouchableOpacity
            key={size.id}
            style={[
              styles.sizeOption,
              selectedSize === size.id && styles.sizeOptionSelected,
            ]}
            onPress={() => onSizeChange(size.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.sizeIcon}>{size.icon}</Text>
            <Text
              style={[
                styles.sizeLabel,
                selectedSize === size.id && styles.sizeLabelSelected,
              ]}
            >
              {size.label}
            </Text>
            <Text
              style={[
                styles.sizeVolume,
                selectedSize === size.id && styles.sizeVolumeSelected,
              ]}
            >
              {size.volume}cl
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  scrollContainer: {
    paddingHorizontal: 10,
  },
  
  sizeOption: {
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    minWidth: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  sizeOptionSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  
  sizeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  
  sizeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  
  sizeLabelSelected: {
    color: '#FFD700',
  },
  
  sizeVolume: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  
  sizeVolumeSelected: {
    color: '#FFD700',
  },
});
