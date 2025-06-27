import { IModel } from "../model";
import { DatabaseItemDto, ItemDto } from "./Item.dto";

export class Item extends IModel {
  id?: string;
  ownerId: string;
  label?: string;
  categoryId: string;
  picture?: string;
  purchaseDate: Date;
  warrantyDuration: string;
  memo?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor(data: ItemDto) {
    super();
    this.id = data.id;
    this.ownerId = data.ownerId;
    this.label = data.label;
    this.categoryId = data.categoryId;
    this.picture = data.picture;
    this.purchaseDate = new Date(data.purchaseDate);
    this.warrantyDuration = data.warrantyDuration;
    this.memo = data.memo;
    this.isArchived = data.isArchived ?? false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  static toDto(data: Item): ItemDto {
    // Provide a default or mapped ItemDto object
    return {
      id: data.id,
      ownerId: data.ownerId ?? "",
      label: data.label ?? "",
      categoryId: data.categoryId ?? "",
      picture: data.picture ?? "",
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
      warrantyDuration: data.warrantyDuration ?? "",
      memo: data.memo ?? "",
      isArchived: data.isArchived ?? false,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  static override fromModel<T, U>(data: T): U {
    let dto: ItemDto;
    if (data instanceof Item) {
      dto = this.toDto(data as Item);
    } else {
      dto = data as ItemDto;
    }
    // Provide a default or mapped DatabaseItemDto object
    const dbItem: DatabaseItemDto = {
      id: dto.id,
      owner_id: dto.ownerId ?? "",
      label: dto.label ?? "",
      category_id: dto.categoryId ?? "",
      purchase_date: dto.purchaseDate ?? "",
      warranty_duration: dto.warrantyDuration ?? "",
      is_archived: dto.isArchived ?? false,
      created_at: dto.createdAt ?? new Date(),
      updated_at: dto.updatedAt ?? new Date(),
    };
    return dbItem as U;
  }
  static override toModel<U, T>(data: U): T {
    const dbData = data as unknown as DatabaseItemDto;
    const item = new Item({
      id: dbData.id,
      ownerId: (dbData as any).ownerId ?? "",
      label: dbData.label ?? "",
      categoryId: dbData.category_id ?? "",
      picture: (dbData as any).picture ?? "",
      purchaseDate: dbData.purchase_date ? new Date(dbData.purchase_date) : new Date(),
      warrantyDuration: dbData.warranty_duration ?? "",
      memo: (dbData as any).memo ?? "",
      isArchived: dbData.is_archived ?? false,
      createdAt: dbData.created_at ? new Date(dbData.created_at) : new Date(),
      updatedAt: dbData.updated_at ? new Date(dbData.updated_at) : new Date(),
    });
    return item as unknown as T;
  }
}
