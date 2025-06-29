export interface DocumentDto {
  id?: string;
  name: string;
  filename: string;
  type: 'invoice' | 'ticket';
  filePath: string;
  fileSource: 'local' | 'remote';
  ownerId: string;
}

export interface DatabaseDocumentDto {
  id?: string;
  name: string;
  filename: string;
  type: 'invoice' | 'ticket';
  file_path: string;
  file_source: 'local' | 'remote';
  owner_id: string;
}