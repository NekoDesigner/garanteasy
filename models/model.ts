import uuid from 'react-native-uuid';

export abstract class IModel {
  id?: string;
  static fromModel<T, U>(data: T): U {
    throw new Error("Method not implemented.");
  }
  static toModel<U, T>(data: U): T {
    throw new Error("Method not implemented.");
  }

  static generateId(): string {
    return uuid.v4();
  }
}