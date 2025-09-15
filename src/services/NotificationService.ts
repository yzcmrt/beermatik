// Beermatik - Bildirim Servisi

import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';
import { 
  NOTIFICATION_MESSAGES, 
  NOTIFICATION_TIMING,
  STORAGE_KEYS 
} from '../utils/constants';
import { 
  calculateNotificationInterval, 
  getRandomNotificationMessage,
  getCurrentTimestamp 
} from '../utils/helpers';

// Bildirim davranışını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  scheduledTime: number;
  isActive: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private storageService: StorageService;
  private scheduledNotifications: Map<string, NotificationData> = new Map();
  private firstBeerTime: number | null = null;
  private notificationInterval: number = NOTIFICATION_TIMING.FIRST_BEER_DELAY;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Bildirim izinlerini ister
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Bildirim izni verilmedi');
        return false;
      }

      // Android için bildirim kanalı oluştur
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('beermatik-reminders', {
          name: 'Beermatik Hatırlatmaları',
          description: 'Bira içme hatırlatmaları',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFD700',
        });
      }

      return true;
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
      return false;
    }
  }

  /**
   * İlk bira sonrası bildirim sistemini başlatır
   */
  public async startNotificationSystem(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      const session = await this.storageService.loadSession();
      
      if (session.beerCount === 1 && session.lastBeerTime > 0) {
        this.firstBeerTime = session.lastBeerTime;
        this.scheduleNextNotification();
      }
    } catch (error) {
      console.error('Bildirim sistemi başlatma hatası:', error);
    }
  }

  /**
   * Bira eklendiğinde bildirim sistemini günceller
   */
  public async onBeerAdded(): Promise<void> {
    try {
      const session = await this.storageService.loadSession();
      
      if (session.beerCount === 1) {
        // İlk bira - bildirim sistemini başlat
        this.firstBeerTime = session.lastBeerTime;
        await this.startNotificationSystem();
      } else if (session.beerCount > 1) {
        // Sonraki biralar - adaptif aralık hesapla
        if (this.firstBeerTime) {
          const timeSinceFirstBeer = session.lastBeerTime - this.firstBeerTime;
          const minutesSinceFirstBeer = timeSinceFirstBeer / (1000 * 60);
          const averageInterval = minutesSinceFirstBeer / (session.beerCount - 1);
          
          this.notificationInterval = calculateNotificationInterval(averageInterval);
        }
        
        // Mevcut bildirimleri iptal et ve yenisini planla
        await this.cancelAllNotifications();
        this.scheduleNextNotification();
      }
    } catch (error) {
      console.error('Bira ekleme bildirim hatası:', error);
    }
  }

  /**
   * Sonraki bildirimi planlar
   */
  private scheduleNextNotification(): void {
    if (!this.firstBeerTime) return;

    const now = getCurrentTimestamp();
    const nextNotificationTime = now + (this.notificationInterval * 60 * 1000);
    
    const notificationId = `beermatik_${nextNotificationTime}`;
    const message = getRandomNotificationMessage();
    
    const notificationData: NotificationData = {
      id: notificationId,
      title: 'Beermatik',
      body: message,
      scheduledTime: nextNotificationTime,
      isActive: true,
    };

    this.scheduledNotifications.set(notificationId, notificationData);

    Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.body,
        sound: 'default',
        data: { type: 'beer_reminder' },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: this.notificationInterval * 60,
      },
    });

    console.log(`Bildirim planlandı: ${new Date(nextNotificationTime).toLocaleString()}`);
  }

  /**
   * Tüm bildirimleri iptal eder
   */
  public async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.scheduledNotifications.clear();
      console.log('Tüm bildirimler iptal edildi');
    } catch (error) {
      console.error('Bildirim iptal hatası:', error);
    }
  }

  /**
   * Belirli bir bildirimi iptal eder
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      this.scheduledNotifications.delete(notificationId);
    } catch (error) {
      console.error('Bildirim iptal hatası:', error);
    }
  }

  /**
   * Bildirim sistemini durdurur
   */
  public async stopNotificationSystem(): Promise<void> {
    await this.cancelAllNotifications();
    this.firstBeerTime = null;
    this.notificationInterval = NOTIFICATION_TIMING.FIRST_BEER_DELAY;
  }

  /**
   * Planlanmış bildirimleri getirir
   */
  public getScheduledNotifications(): NotificationData[] {
    return Array.from(this.scheduledNotifications.values());
  }

  /**
   * Bildirim geçmişini getirir
   */
  public async getNotificationHistory(): Promise<Notifications.Notification[]> {
    try {
      return await Notifications.getPresentedNotificationsAsync();
    } catch (error) {
      console.error('Bildirim geçmişi hatası:', error);
      return [];
    }
  }

  /**
   * Test bildirimi gönderir
   */
  public async sendTestNotification(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Beermatik Test',
          body: 'Bu bir test bildirimidir! 🍺',
          sound: 'default',
        },
        trigger: { 
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2 
        },
      });
    } catch (error) {
      console.error('Test bildirimi hatası:', error);
    }
  }

  /**
   * Bildirim ayarlarını günceller
   */
  public async updateNotificationSettings(enabled: boolean): Promise<void> {
    try {
      await this.storageService.updateNotificationEnabled(enabled);
      
      if (enabled) {
        await this.startNotificationSystem();
      } else {
        await this.stopNotificationSystem();
      }
    } catch (error) {
      console.error('Bildirim ayarları güncelleme hatası:', error);
    }
  }

  /**
   * Bildirim istatistiklerini getirir
   */
  public getNotificationStats(): {
    totalScheduled: number;
    nextNotificationTime: number | null;
    interval: number;
  } {
    const notifications = this.getScheduledNotifications();
    const nextNotification = notifications
      .filter(n => n.isActive)
      .sort((a, b) => a.scheduledTime - b.scheduledTime)[0];

    return {
      totalScheduled: notifications.length,
      nextNotificationTime: nextNotification?.scheduledTime || null,
      interval: this.notificationInterval,
    };
  }
}
