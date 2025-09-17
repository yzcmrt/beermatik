// Beermatik - Bildirim Servisi

import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification, { DeliveredNotification } from 'react-native-push-notification';
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

let pushConfigured = false;
function ensurePushConfigured(): void {
  if (pushConfigured) return;
  PushNotification.configure({
    onNotification: () => {},
    requestPermissions: false,
    popInitialNotification: true,
  });
  pushConfigured = true;
}

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
      ensurePushConfigured();
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        // Kanal oluştur
        PushNotification.createChannel(
          {
            channelId: 'beermatik-reminders',
            channelName: 'Beermatik Hatırlatmaları',
            channelDescription: 'Bira içme hatırlatmaları',
            importance: 4,
            vibrate: true,
            vibration: 250,
            soundName: 'default',
          },
          () => {}
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
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
      ensurePushConfigured();
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      const session = await this.storageService.loadSession();
      
      if (session.beerCount === 1 && session.lastBeerTime > 0) {
        this.firstBeerTime = session.lastBeerTime;
        await this.scheduleNextNotification();
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
        await this.scheduleNextNotification();
      }
    } catch (error) {
      console.error('Bira ekleme bildirim hatası:', error);
    }
  }

  /**
   * Sonraki bildirimi planlar
   */
  private async scheduleNextNotification(): Promise<void> {
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

    PushNotification.localNotificationSchedule({
      channelId: 'beermatik-reminders',
      title: notificationData.title,
      message: notificationData.body,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
      date: new Date(nextNotificationTime),
      userInfo: { type: 'beer_reminder' },
    });

    console.log(`Bildirim planlandı: ${new Date(nextNotificationTime).toLocaleString()}`);
  }

  /**
   * Tüm bildirimleri iptal eder
   */
  public async cancelAllNotifications(): Promise<void> {
    try {
      PushNotification.cancelAllLocalNotifications();
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
      PushNotification.cancelLocalNotification(notificationId);
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
  public async getNotificationHistory(): Promise<DeliveredNotification[]> {
    try {
      return await new Promise<DeliveredNotification[]>((resolve) => {
        PushNotification.getDeliveredNotifications((n: DeliveredNotification[]) => resolve(n));
      });
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
      ensurePushConfigured();
      PushNotification.localNotification({
        channelId: 'beermatik-reminders',
        title: 'Beermatik Test',
        message: 'Bu bir test bildirimidir! 🍺',
        playSound: true,
        soundName: 'default',
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
