import { IModel } from "../model";
import { DocumentDto, DatabaseDocumentDto } from "./Document.dto";

export class Document extends IModel {
  id?: string | undefined;
  name: string;
  filename: string;
  mimeType: string;
  type: 'invoice' | 'ticket' | 'other';
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
    this.mimeType = data.mimetype || 'application/pdf'; // Default to PDF if not provided
    this.ownerId = data.ownerId;
  }

  get typeLabel(): string {
    switch (this.type) {
      case 'invoice':
        return 'Facture';
      case 'ticket':
        return 'Ticket';
      default:
        return 'Document';
    }
  }

  static toDto(data: Document): DocumentDto {
    return {
      id: data.id,
      name: data.name,
      filename: data.filename,
      mimetype: data.mimeType,
      type: data.type,
      filePath: data.filePath,
      fileSource: data.fileSource,
      ownerId: data.ownerId,
    };
  }

  static toDatabaseDto(data: Document): DatabaseDocumentDto {
    return {
      id: data.id,
      name: data.name,
      filename: data.filename,
      mimetype: data.mimeType,
      type: data.type,
      file_path: data.filePath,
      file_source: data.fileSource,
      owner_id: data.ownerId,
    };
  }

  static override fromModel<T, U>(data: T): U {
    let dto: DatabaseDocumentDto;
    if (data instanceof Document) {
      dto = this.toDatabaseDto(data as Document);
    } else {
      dto = data as DatabaseDocumentDto;
    }
    return dto as U;
  }

  static override toModel<U, T>(data: U): T {
    if (data instanceof Document) {
      return data as T;
    } else {
      const dbData = data as DatabaseDocumentDto;
      return new Document({
        id: dbData.id,
        name: dbData.name,
        filename: dbData.filename,
        mimetype: dbData.mimetype,
        type: dbData.type,
        filePath: dbData.file_path,
        fileSource: dbData.file_source,
        ownerId: dbData.owner_id,
      }) as T;
    }
  }
}
