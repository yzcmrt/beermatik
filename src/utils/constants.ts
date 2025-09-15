// Beermatik - Sabitler ve Konfigürasyon

export const BEER_SIZES = [
  { id: '20cl', label: '20cl', volume: 20, icon: '🍺' },
  { id: '25cl', label: '25cl', volume: 25, icon: '🍺' },
  { id: '33cl', label: '33cl', volume: 33, icon: '🍺' },
  { id: '50cl', label: '50cl', volume: 50, icon: '🍺' },
  { id: '75cl', label: '75cl', volume: 75, icon: '🍺' },
  { id: '100cl', label: '1L', volume: 100, icon: '🍺' },
] as const;

export const DEFAULT_BEER_SIZE = '33cl';

export const NOTIFICATION_MESSAGES = [
  "2. biranı içtin mi? 🍺",
  "Biranı unutma! Sayacını güncelle 🍻",
  "Beermatik hatırlatıyor: Bira zamanı! ⏰",
  "Bira molası bitti, devam et! 🍺",
  "Sayaç seni bekliyor! 🍻",
] as const;

export const NOTIFICATION_TIMING = {
  FIRST_BEER_DELAY: 30, // dakika
  MAX_INTERVAL: 120, // maksimum 2 saat
  MIN_INTERVAL: 15, // minimum 15 dakika
} as const;

export const STORAGE_KEYS = {
  BEER_COUNT: 'beerCount',
  TOTAL_VOLUME: 'totalVolume',
  SESSION_START_TIME: 'sessionStartTime',
  LAST_BEER_TIME: 'lastBeerTime',
  SELECTED_SIZE: 'selectedSize',
  NOTIFICATION_ENABLED: 'notificationEnabled',
  BEER_ENTRIES: 'beerEntries',
} as const;

export const COLORS = {
  BACKGROUND: '#000000',
  PRIMARY: '#FFD700', // Altın sarısı
  SECONDARY: '#FFA500', // Turuncu
  ACCENT: '#8B4513', // Koyu kahverengi
  TEXT: '#FFFFFF',
  TEXT_SECONDARY: '#CCCCCC',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
} as const;

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;
