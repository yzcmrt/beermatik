// Beermatik - BeerCounter Test Dosyası

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BeerCounter } from '../components/BeerCounter';

// Mock dependencies
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Vibration: {
      vibrate: jest.fn(),
    },
  };
});

describe('BeerCounter', () => {
  const mockOnBeerAdd = jest.fn();
  
  const defaultProps = {
    beerCount: 0,
    totalVolume: 0,
    selectedSize: '33cl',
    sessionStartTime: Date.now(),
    onBeerAdd: mockOnBeerAdd,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial values', () => {
    const { getByText } = render(<BeerCounter {...defaultProps} />);
    
    expect(getByText('0')).toBeTruthy();
    expect(getByText('Bira')).toBeTruthy();
    expect(getByText('0cl')).toBeTruthy();
  });

  it('displays correct beer count', () => {
    const { getByText } = render(
      <BeerCounter {...defaultProps} beerCount={5} totalVolume={165} />
    );
    
    expect(getByText('5')).toBeTruthy();
  });

  it('calls onBeerAdd when add button is pressed', () => {
    const { getByText } = render(<BeerCounter {...defaultProps} />);
    
    const addButton = getByText('+');
    fireEvent.press(addButton);
    
    expect(mockOnBeerAdd).toHaveBeenCalledTimes(1);
  });

  it('displays correct volume calculation', () => {
    const { getByText } = render(
      <BeerCounter {...defaultProps} beerCount={3} totalVolume={150} selectedSize="50cl" />
    );
    
    expect(getByText('150cl')).toBeTruthy();
  });

  it('shows motivation message for first beer', () => {
    const { getByText } = render(
      <BeerCounter {...defaultProps} beerCount={1} totalVolume={33} />
    );
    
    expect(getByText('İlk bira! 🍺')).toBeTruthy();
  });

  it('shows motivation message for second beer', () => {
    const { getByText } = render(
      <BeerCounter {...defaultProps} beerCount={2} totalVolume={66} />
    );
    
    expect(getByText('İkinci bira! 🍻')).toBeTruthy();
  });
});
