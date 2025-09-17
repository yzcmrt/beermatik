declare module 'react-native-push-notification' {
  import { EmitterSubscription } from 'react-native';
  export interface PushNotificationObject {
    /* iOS/Android common */
    message?: string;
    title?: string;
    playSound?: boolean;
    soundName?: string;
    userInfo?: Record<string, unknown>;
    allowWhileIdle?: boolean;
    /* Android */
    channelId?: string;
    date?: Date;
  }
  export interface DeliveredNotification {
    identifier: string;
    title?: string;
    message?: string;
    userInfo?: Record<string, unknown>;
  }
  export function localNotification(opts: PushNotificationObject): void;
  export function localNotificationSchedule(opts: PushNotificationObject): void;
  export function cancelLocalNotification(id: string): void;
  export function cancelAllLocalNotifications(): void;
  export function getDeliveredNotifications(cb: (n: DeliveredNotification[]) => void): void;
  export function createChannel(
    channel: {
      channelId: string;
      channelName: string;
      channelDescription?: string;
      importance?: number;
      vibrate?: boolean;
      vibration?: number;
      soundName?: string;
    },
    cb: (created: boolean) => void
  ): void;
  export function configure(options: {
    onNotification?: (notification: any) => void;
    requestPermissions?: boolean;
    popInitialNotification?: boolean;
  }): void;
  const _default: any;
  export default _default;
}

