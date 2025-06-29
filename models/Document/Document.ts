import { IModel } from "../model";
import { DocumentDto } from "./Document.dto";

export class Document extends IModel {
  id?: string | undefined;
  name: string;
  filename: string;
  type: 'invoice' | 'ticket';
  filePath: string;
  fileSource: 'local' | 'remote';
  ownerId: string;

  constructor(data: DocumentDto) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.filename = data.filename;
    this.type = data.type;
    this.filePath = data.filePath;
    this.fileSource = data.fileSource;
    this.ownerId = data.ownerId;
  }

  static toDto(data: Document): DocumentDto {
    return {
      id: data.id,
      name: data.name,
      filename: data.filename,
      type: data.type,
      filePath: data.filePath,
      fileSource: data.fileSource,
      ownerId: data.ownerId,
    };
  }

  static override fromModel<T, U>(data: T): U {
    let dto: DocumentDto;
    if (data instanceof Document) {
      dto = this.toDto(data as Document);
    } else {
      dto = data as DocumentDto;
    }
    return dto as U;
  }

  static override toModel<U, T>(data: U): T {
    if (data instanceof Document) {
      return data as T;
    } else {
      return new Document(data as DocumentDto) as T;
    }
  }
}
