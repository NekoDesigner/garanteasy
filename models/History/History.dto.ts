import { Document } from "../Document/Document";

export interface HistoryDto {
  id?: string;
  ItemId: string;
  label: 'repair' | 'maintenance' | 'update' | 'replacement' | 'inspection';
  interventDate: Date;
  description: string;
  documents?: Document[];
}

export interface DatabaseHistoryDto {
  id?: string;
  item_id: string;
  label: 'repair' | 'maintenance' | 'update' | 'replacement' | 'inspection';
  intervention_date: Date;
  description: string;
}
