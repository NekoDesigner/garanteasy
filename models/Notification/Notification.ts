import { DatabaseValidatorException } from "../../exceptions/DatabaseValidatorException";
import { IModel } from "../model";
import { DatabaseNotificationDto, NotificationDto } from "./Notification.dto";

export class Notification extends IModel {
  id?: string | undefined;
  title: string;
  body: string;
  data?: Record<string, any>;
  deviceNotificationId: string; // Unique identifier for the notification on the device
  scheduledTime?: Date; // Optional, for future notifications
  isRead?: boolean; // Optional, to track if the notification has been read
  createdAt?: Date; // Optional, to track when the notification was created

  constructor(data: NotificationDto) {
    super();
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.data = data.data || {};
    this.deviceNotificationId = data.deviceNotificationId;
    this.scheduledTime = data.scheduledTime || new Date();
    this.isRead = data.isRead || false;
    this.createdAt = data.createdAt || new Date();
  }

  static toDto(data: Notification): NotificationDto {
    return {
      id: data.id,
      title: data.title,
      body: data.body,
      data: data.data || {},
      deviceNotificationId: data.deviceNotificationId,
      scheduledTime: data.scheduledTime,
      isRead: data.isRead,
      createdAt: data.createdAt,
    };
  }

  static toDatabaseDto(data: Notification): DatabaseNotificationDto {
    if (data.deviceNotificationId === undefined || data.deviceNotificationId === null || data.deviceNotificationId === '') {
      throw new DatabaseValidatorException("Device notification ID is required for database storage.");
    }
    return {
      id: data.id,
      title: data.title,
      body: data.body,
      data: data.data ? JSON.stringify(data.data) : undefined,
      device_notification_id: data.deviceNotificationId,
      scheduled_time: data.scheduledTime,
      is_read: data.isRead || false,
      created_at: data.createdAt
    };
  }

  static override fromModel<T, U>(data: T): U {
    let dto: DatabaseNotificationDto;
    if (data instanceof Notification) {
      dto = Notification.toDatabaseDto(data as Notification);
    } else {
      dto = data as DatabaseNotificationDto;
    }
    return dto as U;
  }

  static override toModel<U, T>(data: U): T {
    if (data instanceof Notification) {
      return data as T;
    }

    const notificationData = data as DatabaseNotificationDto;
    return new Notification({
      id: notificationData.id,
      title: notificationData.title,
      body: notificationData.body,
      data: notificationData.data ? JSON.parse(notificationData.data) : {},
      deviceNotificationId: notificationData.device_notification_id,
      scheduledTime: notificationData.scheduled_time ? new Date(notificationData.scheduled_time) : undefined,
      isRead: notificationData.is_read || false,
      createdAt: notificationData.created_at ? new Date(notificationData.created_at) : new Date(),
    }) as T;
  }
}
