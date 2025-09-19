// Beermatik - Bildirim Servisi

import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification, { PushNotificationObject } from 'react-native-push-notification';
import { StorageService, BeerSession } from './StorageService';
import {
  NOTIFICATION_TIMING,
} from '../utils/constants';
import {
  getCurrentTimestamp,
} from '../utils/helpers';

const REMINDER_NOTIFICATION_ID = 'beermatik-reminder';

let pushConfigured = false;
function ensurePushConfigured(): void {
  if (pushConfigured) {
    return;
  }

  PushNotification.configure({
    onNotification: (notification: PushNotificationObject | Record<string, unknown>) => {
      console.log('Bildirim alındı:', notification);
    },
    requestPermissions: false,
    popInitialNotification: true,
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  });

  pushConfigured = true;
}

function ensureAndroidChannel(): void {
  if (Platform.OS !== 'android') {
    return;
  }

  PushNotification.createChannel(
    {
      channelId: 'beermatik-reminders',
      channelName: 'Beermatik Hatırlatmaları',
      channelDescription: 'Bira tüketim hatırlatmaları',
      importance: 4,
      vibrate: true,
      vibration: 250,
      soundName: 'default',
    },
    () => {}
  );
}

export interface NotificationStats {
  totalScheduled: number;
  nextNotificationTime: number | null;
  interval: number | null;
}

export class NotificationService {
  private static instance: NotificationService;
  private storageService: StorageService;
  private lastScheduledId: string | null = null;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async ensurePermissions(): Promise<boolean> {
    try {
      ensurePushConfigured();

      if (Platform.OS === 'android') {
        ensureAndroidChannel();
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }

      const permissionResult = await PushNotification.requestPermissions();
      if (typeof permissionResult === 'boolean') {
        return permissionResult;
      }

      return Boolean(permissionResult?.alert || permissionResult?.badge || permissionResult?.sound);
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
      return false;
    }
  }

  public async startNotificationSystem(): Promise<void> {
    try {
      const session = await this.storageService.loadSession();
      if (!session.notificationEnabled) {
        return;
      }

      const hasPermission = await this.ensurePermissions();
      if (!hasPermission) {
        await this.disableNotifications();
        return;
      }

      await this.scheduleFromSession(session);
    } catch (error) {
      console.error('Bildirim sistemi başlatma hatası:', error);
    }
  }

  public async onBeerAdded(): Promise<void> {
    try {
      const session = await this.storageService.loadSession();
      if (!session.notificationEnabled) {
        return;
      }

      const hasPermission = await this.ensurePermissions();
      if (!hasPermission) {
        await this.disableNotifications();
        return;
      }

      await this.scheduleFromSession(session);
    } catch (error) {
      console.error('Bira ekleme bildirim hatası:', error);
    }
  }

  private async scheduleFromSession(session: BeerSession): Promise<void> {
    const { notificationInterval, nextNotificationTime, beerCount } = session;

    if (!notificationInterval || !nextNotificationTime) {
      await this.storageService.updateNotificationSchedule(null, null);
      await this.cancelAllNotifications();
      return;
    }

    let scheduledTime = nextNotificationTime;
    const now = getCurrentTimestamp();

    if (scheduledTime <= now) {
      let interval = notificationInterval;
      if (!interval || interval <= 0) {
        interval = NOTIFICATION_TIMING.MIN_FALLBACK_MINUTES * 60 * 1000;
      }

      while (scheduledTime <= now) {
        scheduledTime += interval;
      }

      await this.storageService.updateNotificationSchedule(interval, scheduledTime);
    }

    await this.cancelAllNotifications();

    const nextBeerNumber = beerCount + 1;
    const minutesUntilRaw = Math.round((scheduledTime - now) / (1000 * 60));
    const minutesUntil = Math.max(minutesUntilRaw, NOTIFICATION_TIMING.MIN_FALLBACK_MINUTES);
    const message = `${nextBeerNumber}. birayı aldın mı? 🍺 (${minutesUntil} dk oldu)`;

    await this.storageService.updateNotificationSchedule(notificationInterval, scheduledTime);

    const notificationConfig: any = {
      id: REMINDER_NOTIFICATION_ID,
      channelId: 'beermatik-reminders',
      title: 'Beermatik',
      message,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
      date: new Date(scheduledTime),
      userInfo: {
        type: 'beer_reminder',
        scheduledTime,
        interval: notificationInterval,
      },
    };

    if (Platform.OS === 'android') {
      notificationConfig.priority = 'high';
      notificationConfig.visibility = 'public';
      notificationConfig.importance = 'high';
    }

    PushNotification.localNotificationSchedule(notificationConfig);
    this.lastScheduledId = REMINDER_NOTIFICATION_ID;
    console.log(`Bildirim planlandı: ${new Date(scheduledTime).toLocaleString()}`);
  }

  public async cancelAllNotifications(): Promise<void> {
    try {
      if (this.lastScheduledId) {
        PushNotification.cancelLocalNotification(this.lastScheduledId);
      }
      PushNotification.cancelAllLocalNotifications();
      this.lastScheduledId = null;
    } catch (error) {
      console.error('Bildirim iptal hatası:', error);
    }
  }

  public async stopNotificationSystem(): Promise<void> {
    await this.cancelAllNotifications();
    await this.storageService.updateNotificationSchedule(null, null);
  }

  private async disableNotifications(): Promise<void> {
    await this.storageService.updateNotificationEnabled(false);
    await this.storageService.updateNotificationSchedule(null, null);
    await this.cancelAllNotifications();
  }

  public async updateNotificationSettings(enabled: boolean): Promise<void> {
    if (!enabled) {
      await this.storageService.updateNotificationEnabled(false);
      await this.stopNotificationSystem();
      return;
    }

    const hasPermission = await this.ensurePermissions();
    if (!hasPermission) {
      await this.disableNotifications();
      return;
    }

    await this.storageService.updateNotificationEnabled(true);
    const session = await this.storageService.loadSession();
    await this.scheduleFromSession(session);
  }

  public async sendTestNotification(): Promise<void> {
    const hasPermission = await this.ensurePermissions();
    if (!hasPermission) {
      await this.disableNotifications();
      return;
    }

    const now = getCurrentTimestamp();
    const date = new Date(now + 2000);

    PushNotification.localNotificationSchedule({
      id: `${REMINDER_NOTIFICATION_ID}-test-${now}`,
      channelId: 'beermatik-reminders',
      title: 'Beermatik',
      message: 'Sistem testi: Bira sayacını güncelledin mi? 🍻',
      date,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
    });
  }

  public getNotificationStats(): NotificationStats {
    const cached = this.storageService.getCachedData();
    return {
      totalScheduled: cached.nextNotificationTime ? 1 : 0,
      nextNotificationTime: cached.nextNotificationTime ?? null,
      interval: cached.notificationInterval ?? null,
    };
  }
}
