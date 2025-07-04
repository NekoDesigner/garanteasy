export interface NotificationDto {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  deviceNotificationId: string; // Unique identifier for the notification on the device
  scheduledTime?: Date; // Optional, for future notifications
  isRead?: boolean; // Optional, to track if the notification has been read
  createdAt?: Date; // Optional, to track when the notification was created
}

export interface DatabaseNotificationDto {
  id?: string;
  title: string;
  body: string;
  data?: string; // JSON stringified data
  device_notification_id: string; // Unique identifier for the notification on the device
  scheduled_time?: Date; // Optional, for future notifications
  is_read?: boolean; // Optional, to track if the notification has been read
  created_at?: Date; // Optional, to track when the notification was created
}
