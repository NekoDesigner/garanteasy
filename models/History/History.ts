import { Document } from "../Document/Document";
import { IModel } from "../model";
import { DatabaseHistoryDto, HistoryDto } from "./History.dto";

export type HistoryLabel = 'repair' | 'maintenance' | 'update' | 'replacement' | 'inspection';

export class History extends IModel {
  id?: string;
  ItemId: string;
  label: HistoryLabel;
  interventDate: Date;
  description: string;
  documents: Document[];

  constructor(data: HistoryDto) {
    super();
    this.id = data.id;
    this.ItemId = data.ItemId;
    this.label = data.label;
    this.interventDate = data.interventDate;
    this.description = data.description;
    this.documents = data.documents || [];
  }

  static toDto(data: History): HistoryDto {
      return {
        id: data.id,
        ItemId: data.ItemId,
        label: data.label,
        interventDate: data.interventDate,
        description: data.description
      };
  }

    static toDatabaseDto(data: History): DatabaseHistoryDto {
      return {
        id: data.id,
        item_id: data.ItemId,
        label: data.label,
        intervention_date: data.interventDate,
        description: data.description
      };
    }

    static override fromModel<T, U>(data: T): U {
      let dto: DatabaseHistoryDto;
      if (data instanceof History) {
        dto = History.toDatabaseDto(data as History);
      } else {
        dto = data as DatabaseHistoryDto;
      }
      return dto as U;
    }

    static override toModel<U, T>(data: U): T {
      if (data instanceof History) {
        return data as T;
      } else {
        const dbData = data as DatabaseHistoryDto;
        return new History({
          id: dbData.id,
          ItemId: dbData.item_id,
          label: dbData.label,
          interventDate: dbData.intervention_date,
          description: dbData.description
        }) as T;
      }
    }

  static setLabelToDatabaseFormat(label: 'Réparation' | 'Maintenance' | 'Mise à jour' | 'Remplacement' | 'Inspection'): HistoryLabel {
    switch (label) {
      case 'Réparation':
        return 'repair';
      case 'Maintenance':
        return 'maintenance';
      case 'Mise à jour':
        return 'update';
      case 'Remplacement':
        return 'replacement';
      case 'Inspection':
        return 'inspection';
    }
  }

  static setLabelToDisplayFormat(label: HistoryLabel): 'Réparation' | 'Maintenance' | 'Mise à jour' | 'Remplacement' | 'Inspection' {
    switch (label) {
      case 'repair':
        return 'Réparation';
      case 'maintenance':
        return 'Maintenance';
      case 'update':
        return 'Mise à jour';
      case 'replacement':
        return 'Remplacement';
      case 'inspection':
        return 'Inspection';
    }
  }
}
