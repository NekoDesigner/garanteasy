export interface IKeySettingValue {
  notifications_enabled: boolean;
}

export const enum EKeySetting {
  ENABLE_NOTIFICATIONS = 'notifications_enabled'
}

export interface SettingDto {
  id?: string;
  key: EKeySetting;
  label: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseSettingDto {
  id?: string;
  key: EKeySetting;
  label: string;
  value: string;
  created_at: Date;
  updated_at: Date;
}