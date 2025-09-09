export interface DocumentDto {
  id?: string;
  name: string;
  filename: string;
  mimetype: string;
  type: 'invoice' | 'ticket' | 'intervention' | 'other';
  filePath: string;
  fileSource: 'local' | 'remote';
  ownerId: string;
}

export interface DatabaseDocumentDto {
  id?: string;
  name: string;
  filename: string;
  mimetype: string;
  type: 'invoice' | 'ticket' | 'intervention' | 'other';
  file_path: string;
  file_source: 'local' | 'remote';
  owner_id: string;
  entity_model: string;
  entity_id: string;
}