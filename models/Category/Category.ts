import { IModel } from "../model";

export class Category extends IModel {
  id?: string;
  ownerId: string;
  name: string;

  constructor(data: { id?: string; ownerId: string; name: string }) {
    super();
    this.id = data.id;
    this.ownerId = data.ownerId;
    this.name = data.name;
  }

  static toDto(data: Category): { id?: string; ownerId: string; name: string } {
    return {
      id: data.id,
      ownerId: data.ownerId,
      name: data.name,
    };
  }

  static toDatabaseDto(data: Category): { id?: string; owner_id: string; name: string } {
    return {
      id: data.id,
      owner_id: data.ownerId,
      name: data.name,
    };
  }
  static fromModel<T, U>(data: T): U {
    let dto: { id?: string; owner_id: string; name: string };
    if (data instanceof Category) {
      dto = this.toDatabaseDto(data as Category);
    } else {
      dto = data as { id?: string; owner_id: string; name: string };
    }
    return dto as U;
  }
  static toModel<U, T>(data: U): T {
    if (data instanceof Category) {
      return data as T;
    } else {
      const dbData = data as { id?: string; owner_id: string; name: string };
      return new Category({
        id: dbData.id,
        ownerId: dbData.owner_id,
        name: dbData.name,
      }) as T;
    }
  }
}