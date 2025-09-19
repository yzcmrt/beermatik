// Beermatik - Veri Kalıcılığı Servisi

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATION_TIMING, STORAGE_KEYS } from '../utils/constants';

export interface BeerEntry {
  id: string;
  size: string;
  volume: number;
  timestamp: number;
}

export interface BeerSession {
  beerCount: number;
  totalVolume: number;
  sessionStartTime: number;
  lastBeerTime: number;
  selectedSize: string;
  notificationEnabled: boolean;
  beerEntries: BeerEntry[];
  notificationInterval: number | null;
  nextNotificationTime: number | null;
}

export class StorageService {
  private static instance: StorageService;
  private cache: Partial<BeerSession> = {};

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Tüm veriyi yükler
   */
  public async loadSession(): Promise<BeerSession> {
    try {
      const [
        beerCount,
        totalVolume,
        sessionStartTime,
        lastBeerTime,
        selectedSize,
        notificationEnabled,
        beerEntries,
        notificationInterval,
        nextNotificationTime,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BEER_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_VOLUME),
        AsyncStorage.getItem(STORAGE_KEYS.SESSION_START_TIME),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_BEER_TIME),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_ENABLED),
        AsyncStorage.getItem(STORAGE_KEYS.BEER_ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_INTERVAL),
        AsyncStorage.getItem(STORAGE_KEYS.NEXT_NOTIFICATION_TIME),
      ]);

      const parsedBeerEntries: BeerEntry[] = beerEntries ? JSON.parse(beerEntries) : [];

      const session: BeerSession = {
        beerCount: beerCount ? parseInt(beerCount, 10) : 0,
        totalVolume: totalVolume ? parseFloat(totalVolume) : 0,
        sessionStartTime: sessionStartTime ? parseInt(sessionStartTime, 10) : Date.now(),
        lastBeerTime: lastBeerTime ? parseInt(lastBeerTime, 10) : 0,
        selectedSize: selectedSize || '33cl',
        notificationEnabled: notificationEnabled === 'true',
        beerEntries: parsedBeerEntries,
        notificationInterval: notificationInterval ? parseInt(notificationInterval, 10) : null,
        nextNotificationTime: nextNotificationTime ? parseInt(nextNotificationTime, 10) : null,
      };

      this.cache = session;
      return session;
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      return this.getDefaultSession();
    }
  }

  /**
   * Bira ekler
   */
  public async addBeer(size: string, volume: number): Promise<void> {
    try {
      const newBeerEntry: BeerEntry = {
        id: Date.now().toString(),
        size,
        volume,
        timestamp: Date.now(),
      };

      const currentEntries = this.cache.beerEntries || [];
      const updatedEntries = [...currentEntries, newBeerEntry];

      const newCount = updatedEntries.length;
      const newTotalVolume = updatedEntries.reduce((sum, entry) => sum + entry.volume, 0);

      const { intervalMs, nextNotificationTime } = this.calculateNextNotification(updatedEntries);

      const tasks: Promise<void>[] = [
        AsyncStorage.setItem(STORAGE_KEYS.BEER_COUNT, newCount.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TOTAL_VOLUME, newTotalVolume.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.BEER_ENTRIES, JSON.stringify(updatedEntries)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_BEER_TIME, newBeerEntry.timestamp.toString()),
      ];

      if (intervalMs === null) {
        tasks.push(AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_INTERVAL));
      } else {
        tasks.push(AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_INTERVAL, intervalMs.toString()));
      }

      if (nextNotificationTime === null) {
        tasks.push(AsyncStorage.removeItem(STORAGE_KEYS.NEXT_NOTIFICATION_TIME));
      } else {
        tasks.push(
          AsyncStorage.setItem(
            STORAGE_KEYS.NEXT_NOTIFICATION_TIME,
            nextNotificationTime.toString()
          )
        );
      }

      await Promise.all(tasks);

      this.cache.beerCount = newCount;
      this.cache.totalVolume = newTotalVolume;
      this.cache.beerEntries = updatedEntries;
      this.cache.lastBeerTime = newBeerEntry.timestamp;
      this.cache.notificationInterval = intervalMs;
      this.cache.nextNotificationTime = nextNotificationTime;
    } catch (error) {
      console.error('Bira ekleme hatası:', error);
    }
  }

  /**
   * Bira sayısını günceller (eski metod - geriye uyumluluk için)
   */
  public async updateBeerCount(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BEER_COUNT, count.toString());
      this.cache.beerCount = count;
    } catch (error) {
      console.error('Bira sayısı güncelleme hatası:', error);
    }
  }

  /**
   * Toplam hacmi günceller
   */
  public async updateTotalVolume(volume: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_VOLUME, volume.toString());
      this.cache.totalVolume = volume;
    } catch (error) {
      console.error('Toplam hacim güncelleme hatası:', error);
    }
  }

  /**
   * Son bira zamanını günceller
   */
  public async updateLastBeerTime(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_BEER_TIME, timestamp.toString());
      this.cache.lastBeerTime = timestamp;
    } catch (error) {
      console.error('Son bira zamanı güncelleme hatası:', error);
    }
  }

  /**
   * Seçili boyutu günceller
   */
  public async updateSelectedSize(size: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_SIZE, size);
      this.cache.selectedSize = size;
    } catch (error) {
      console.error('Seçili boyut güncelleme hatası:', error);
    }
  }

  /**
   * Bildirim ayarını günceller
   */
  public async updateNotificationEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_ENABLED, enabled.toString());
      this.cache.notificationEnabled = enabled;
    } catch (error) {
      console.error('Bildirim ayarı güncelleme hatası:', error);
    }
  }

  /**
   * Yeni oturum başlatır
   */
  public async startNewSession(): Promise<void> {
    try {
      const now = Date.now();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.BEER_COUNT, '0'),
        AsyncStorage.setItem(STORAGE_KEYS.TOTAL_VOLUME, '0'),
        AsyncStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, now.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_BEER_TIME, '0'),
        AsyncStorage.setItem(STORAGE_KEYS.BEER_ENTRIES, JSON.stringify([])),
        AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_INTERVAL),
        AsyncStorage.removeItem(STORAGE_KEYS.NEXT_NOTIFICATION_TIME),
      ]);

      this.cache = {
        ...this.cache,
        beerCount: 0,
        totalVolume: 0,
        sessionStartTime: now,
        lastBeerTime: 0,
        beerEntries: [],
        notificationInterval: null,
        nextNotificationTime: null,
      };
    } catch (error) {
      console.error('Yeni oturum başlatma hatası:', error);
    }
  }

  /**
   * Tüm veriyi temizler
   */
  public async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.BEER_COUNT,
        STORAGE_KEYS.TOTAL_VOLUME,
        STORAGE_KEYS.SESSION_START_TIME,
        STORAGE_KEYS.LAST_BEER_TIME,
        STORAGE_KEYS.SELECTED_SIZE,
        STORAGE_KEYS.NOTIFICATION_ENABLED,
        STORAGE_KEYS.BEER_ENTRIES,
        STORAGE_KEYS.NOTIFICATION_INTERVAL,
        STORAGE_KEYS.NEXT_NOTIFICATION_TIME,
      ]);

      this.cache = {};
    } catch (error) {
      console.error('Veri temizleme hatası:', error);
    }
  }

  /**
   * Cache'den veri alır
   */
  public getCachedData(): Partial<BeerSession> {
    return { ...this.cache };
  }

  /**
   * Varsayılan oturum verisi
   */
  private getDefaultSession(): BeerSession {
    return {
      beerCount: 0,
      totalVolume: 0,
      sessionStartTime: Date.now(),
      lastBeerTime: 0,
      selectedSize: '33cl',
      notificationEnabled: false,
      beerEntries: [],
      notificationInterval: null,
      nextNotificationTime: null,
    };
  }

  /**
   * Veri yedekleme (gelecekteki özellik için)
   */
  public async exportData(): Promise<string> {
    try {
      const session = await this.loadSession();
      return JSON.stringify(session, null, 2);
    } catch (error) {
      console.error('Veri dışa aktarma hatası:', error);
      return '';
    }
  }

  /**
   * Veri geri yükleme (gelecekteki özellik için)
   */
  public async importData(data: string): Promise<boolean> {
    try {
      const session: BeerSession = JSON.parse(data);
      
      await Promise.all([
        this.updateBeerCount(session.beerCount),
        this.updateTotalVolume(session.totalVolume),
        this.updateSelectedSize(session.selectedSize),
        this.updateNotificationEnabled(session.notificationEnabled),
        AsyncStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, session.sessionStartTime.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_BEER_TIME, session.lastBeerTime.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.BEER_ENTRIES, JSON.stringify(session.beerEntries ?? [])),
        session.notificationInterval !== null
          ? AsyncStorage.setItem(
              STORAGE_KEYS.NOTIFICATION_INTERVAL,
              session.notificationInterval.toString()
            )
          : AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_INTERVAL),
        session.nextNotificationTime !== null
          ? AsyncStorage.setItem(
              STORAGE_KEYS.NEXT_NOTIFICATION_TIME,
              session.nextNotificationTime.toString()
            )
          : AsyncStorage.removeItem(STORAGE_KEYS.NEXT_NOTIFICATION_TIME),
      ]);

      return true;
    } catch (error) {
      console.error('Veri içe aktarma hatası:', error);
      return false;
    }
  }

  /**
   * Bildirim planını günceller
   */
  public async updateNotificationSchedule(
    intervalMs: number | null,
    nextNotificationTime: number | null
  ): Promise<void> {
    try {
      if (intervalMs === null) {
        await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_INTERVAL);
        this.cache.notificationInterval = null;
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_INTERVAL, intervalMs.toString());
        this.cache.notificationInterval = intervalMs;
      }

      if (nextNotificationTime === null) {
        await AsyncStorage.removeItem(STORAGE_KEYS.NEXT_NOTIFICATION_TIME);
        this.cache.nextNotificationTime = null;
      } else {
        await AsyncStorage.setItem(
          STORAGE_KEYS.NEXT_NOTIFICATION_TIME,
          nextNotificationTime.toString()
        );
        this.cache.nextNotificationTime = nextNotificationTime;
      }
    } catch (error) {
      console.error('Bildirim planı güncelleme hatası:', error);
    }
  }

  private calculateNextNotification(entries: BeerEntry[]): {
    intervalMs: number | null;
    nextNotificationTime: number | null;
  } {
    if (entries.length === 0) {
      return { intervalMs: null, nextNotificationTime: null };
    }

    const lastEntry = entries[entries.length - 1];

    if (entries.length < 2) {
      return { intervalMs: null, nextNotificationTime: null };
    }

    const prevEntry = entries[entries.length - 2];
    let intervalMs = lastEntry.timestamp - prevEntry.timestamp;

    if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
      intervalMs = NOTIFICATION_TIMING.MIN_FALLBACK_MINUTES * 60 * 1000;
    }

    const maxIntervalMs = NOTIFICATION_TIMING.MAX_SAFETY_MINUTES * 60 * 1000;
    intervalMs = Math.min(intervalMs, maxIntervalMs);

    return {
      intervalMs,
      nextNotificationTime: lastEntry.timestamp + intervalMs,
    };
  }
}
