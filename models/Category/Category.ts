import { IChipsProps } from "../../components/ui/Chips/@types";
import { CATEGORIES_BASE } from "../../constants/Categories";
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
      dto = Category.toDatabaseDto(data as Category);
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

  showIcon(): boolean {
    return !(this.name.toLowerCase() === 'autre' || this.name.toLowerCase() === 'other' || this.id === 'default-category-7');
  }

  clone(): Category {
    return new Category({
      id: this.id,
      ownerId: this.ownerId,
      name: this.name,
    });
  }

  getCategoryChipsProps(): IChipsProps {
    const category = this.clone();
    switch (category.id) {
      case "default-category-1":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "hoursehold-electricals") as IChipsProps;
      case "default-category-2":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "small-electricals") as IChipsProps;
      case "default-category-3":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "diy") as IChipsProps;
      case "default-category-4":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "garden") as IChipsProps;
      case "default-category-5":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "fashion") as IChipsProps;
      case "default-category-6":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "multimedia") as IChipsProps;
      case "default-category-7":
        return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "other") as IChipsProps;
    }
    return CATEGORIES_BASE.find((item: IChipsProps) => item.category === "other") as IChipsProps;
  }
}