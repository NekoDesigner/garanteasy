import { DateService } from "../../services/DateService";
import { Category } from "../Category/Category";
import { Document } from "../Document/Document";
import { IModel } from "../model";
import { Notification } from "../Notification/Notification";
import { DatabaseItemDto, ItemDto } from "./Item.dto";

export class Item extends IModel {
  id?: string;
  ownerId: string;
  label?: string;
  brand?: string;
  categoryId: string;
  picture?: string;
  purchaseDate: Date;
  warrantyDuration: string;
  memo?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  documents?: Document[];
  category: Category | null = null;
  notifications: Notification[] = [];
  constructor(data: ItemDto) {
    super();
    this.id = data.id;
    this.ownerId = data.ownerId;
    this.label = data.label;
    this.brand = data.brand;
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
      brand: data.brand ?? "",
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
      dto = Item.toDto(data as Item);
    } else {
      dto = data as ItemDto;
    }
    // Provide a default or mapped DatabaseItemDto object
    const dbItem: DatabaseItemDto = {
      id: dto.id,
      owner_id: dto.ownerId ?? "",
      label: dto.label ?? "",
      brand: dto.brand,
      category_id: dto.categoryId ?? "",
      picture: dto.picture,
      purchase_date: dto.purchaseDate ?? "",
      warranty_duration: dto.warrantyDuration ?? "",
      memo: dto.memo,
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
      ownerId: dbData.owner_id,
      label: dbData.label ?? "",
      brand: dbData.brand,
      categoryId: dbData.category_id ?? "",
      picture: dbData.picture,
      purchaseDate: dbData.purchase_date ? new Date(dbData.purchase_date) : new Date(),
      warrantyDuration: dbData.warranty_duration ?? "",
      memo: dbData.memo ?? "",
      isArchived: dbData.is_archived ?? false,
      createdAt: dbData.created_at ? new Date(dbData.created_at) : new Date(),
      updatedAt: dbData.updated_at ? new Date(dbData.updated_at) : new Date(),
    });
    return item as unknown as T;
  }

  static setItemIsArchived(item: Item): Item {
    const warrantyDurationInDays = DateService.getWarrantyDurationInDays(item.warrantyDuration);
    item.isArchived = DateService.isItemExpired(item.purchaseDate, warrantyDurationInDays);
    return item;
  }

  get otherDocuments(): Document[] {
    return this.documents?.filter((doc) => doc.type !== "invoice" && doc.type !== "ticket") || [];
  }

  get warrantyDocument(): Document | undefined {
    return this.documents?.find((doc) => doc.type === "invoice" || doc.type === "ticket");
  }

  get purchaseDateFormatted(): string {
    return DateService.formatDDMMYYYY(this.purchaseDate);
  }

  get warrantyEndDate(): Date {
    const warrantyDurationInDays = DateService.getWarrantyDurationInDays(this.warrantyDuration);
    return DateService.addDays(this.purchaseDate, warrantyDurationInDays);
  }
}
