// Beermatik - Yardımcı Fonksiyonlar

import moment from 'moment';
import { BEER_SIZES } from './constants';

/**
 * Zamanı formatlar
 */
export const formatTime = (timestamp: number): string => {
  return moment(timestamp).format('HH:mm');
};

/**
 * Geçen süreyi hesaplar
 */
export const getElapsedTime = (startTime: number): string => {
  const now = moment();
  const start = moment(startTime);
  const duration = moment.duration(now.diff(start));
  
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  
  if (hours > 0) {
    return `${hours}s ${minutes}dk`;
  }
  return `${minutes}dk`;
};

/**
 * Bira boyutuna göre hacim hesaplar
 */
export const calculateVolume = (count: number, sizeId: string): number => {
  const size = BEER_SIZES.find(s => s.id === sizeId);
  return size ? count * size.volume : 0;
};

/**
 * Bildirim aralığını hesaplar
 */
export const calculateNotificationInterval = (firstInterval: number): number => {
  const { MIN_INTERVAL, MAX_INTERVAL } = require('./constants').NOTIFICATION_TIMING;
  
  // İlk aralığa göre adaptif aralık hesapla
  let interval = firstInterval;
  
  // Minimum ve maksimum sınırları uygula
  interval = Math.max(interval, MIN_INTERVAL);
  interval = Math.min(interval, MAX_INTERVAL);
  
  return interval;
};

/**
 * Rastgele bildirim mesajı seçer
 */
export const getRandomNotificationMessage = (): string => {
  const { NOTIFICATION_MESSAGES } = require('./constants');
  const randomIndex = Math.floor(Math.random() * NOTIFICATION_MESSAGES.length);
  return NOTIFICATION_MESSAGES[randomIndex];
};

/**
 * Haptic feedback için titreşim paterni
 */
export const getHapticPattern = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  switch (type) {
    case 'light':
      return { type: 'light' as const };
    case 'medium':
      return { type: 'medium' as const };
    case 'heavy':
      return { type: 'heavy' as const };
    default:
      return { type: 'medium' as const };
  }
};

/**
 * Sayıyı formatlar (binlik ayırıcı ile)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('tr-TR');
};

/**
 * Yüzde hesaplar
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Zaman damgası oluşturur
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Tarih formatlar
 */
export const formatDate = (timestamp: number): string => {
  return moment(timestamp).format('DD.MM.YYYY');
};

/**
 * Saat formatlar
 */
export const formatHour = (timestamp: number): string => {
  return moment(timestamp).format('HH:mm');
};
