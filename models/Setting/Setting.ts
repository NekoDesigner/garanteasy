import { IModel } from "../model";
import { DatabaseSettingDto, EKeySetting, SettingDto } from "./Setting.dto";

export class Setting extends IModel {
  id?: string;
  key: EKeySetting;
  label: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: { id?: string; key: EKeySetting; Label: string; value: string; createdAt?: Date; updatedAt?: Date }) {
    super();
    this.id = data.id;
    this.key = data.key;
    this.label = data.Label;
    this.value = data.value;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  static toDto(data: Setting): SettingDto {
        return {
          id: data.id,
          key: data.key,
          label: data.label,
          value: data.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
    }

  static toDatabaseDto(data: Setting): DatabaseSettingDto {
        return {
          id: data.id,
          key: data.key,
          label: data.label,
          value: data.value,
          created_at: data.createdAt,
          updated_at: data.updatedAt
        };
      }
  static override fromModel<T, U>(data: T): U {
        let dto: DatabaseSettingDto;
        if (data instanceof Setting) {
          dto = Setting.toDatabaseDto(data as Setting);
        } else {
          dto = data as DatabaseSettingDto;
        }
        return dto as U;
  }

  static override toModel<U, T>(data: U): T {
        if (data instanceof Setting) {
          return data as T;
        } else {
          const dbData = data as DatabaseSettingDto;
          return new Setting({
            id: dbData.id,
            key: dbData.key,
            Label: dbData.label,
            value: dbData.value,
            createdAt: dbData.created_at,
            updatedAt: dbData.updated_at
          }) as T;
        }
  }

  getIconIdentifier(): string | null {
    switch (this.key) {
      case EKeySetting.ENABLE_NOTIFICATIONS:
        return "bell";
      default:
        return null;
    }
  }

  getInputType(): "switch" | "input-text" | "input-number" | "input-password" | "input-date" {
    switch (this.key) {
      case EKeySetting.ENABLE_NOTIFICATIONS:
        return "switch";
      default:
        return "input-text";
    }
  }
}
