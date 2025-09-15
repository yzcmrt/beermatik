// Beermatik - Global Stil Tanımları

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  // Text Styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  subtitle: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 30,
  },
  
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  
  volumeText: {
    fontSize: 24,
    color: COLORS.SECONDARY,
    textAlign: 'center',
    marginTop: 10,
  },
  
  timeText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 5,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 120,
  },
  
  primaryButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 120,
  },
  
  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  resetButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  
  resetButtonText: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Card Styles
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  
  // Beer Icon Styles
  beerIcon: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Size Selector Styles
  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  
  sizeOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    minWidth: 60,
  },
  
  sizeOptionSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  
  sizeOptionText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  
  sizeOptionTextSelected: {
    color: COLORS.PRIMARY,
  },
  
  // Counter Styles
  counterContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  
  counterButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  counterButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 36,
    fontWeight: 'bold',
  },
  
  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 5,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minWidth: width * 0.8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  modalText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  // Responsive Styles
  smallScreen: {
    fontSize: 14,
  },
  
  largeScreen: {
    fontSize: 18,
  },
});

// Responsive font sizes
export const getResponsiveFontSize = (baseSize: number): number => {
  const scale = width / 375; // iPhone X base width
  return Math.max(baseSize * scale, baseSize * 0.8);
};

// Animation styles
export const animationStyles = StyleSheet.create({
  fadeIn: {
    opacity: 0,
  },
  
  fadeInActive: {
    opacity: 1,
  },
  
  slideUp: {
    transform: [{ translateY: 50 }],
    opacity: 0,
  },
  
  slideUpActive: {
    transform: [{ translateY: 0 }],
    opacity: 1,
  },
  
  scaleIn: {
    transform: [{ scale: 0.8 }],
    opacity: 0,
  },
  
  scaleInActive: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  
  bounce: {
    transform: [{ scale: 1.1 }],
  },
  
  bounceActive: {
    transform: [{ scale: 1 }],
  },
});
