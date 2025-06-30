export interface ItemDto {
  id?: string;
  label: string;
  picture?: string;
  brand?: string;
  purchaseDate: Date;
  warrantyDuration: string;
  memo: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  categoryId: string;
}

export interface DatabaseItemDto {
  id?: string;
  owner_id: string;
  label: string;
  brand?: string;
  category_id: string;
  picture?: string;
  purchase_date: Date;
  warranty_duration: string;
  memo?: string;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}