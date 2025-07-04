/**
 * useDocument    const query = `SELECT * FROM documents WHERE owner_id = ?`;
    const result = await db.getAllAsync<DatabaseDocumentDto>(query, [props.ownerId]);
    const documents: Document[] = result.map((doc) => Document.toModel(doc));
    return documents;itory - Generated by Garanteasier CLI
 */

import { SQLiteExecuteAsyncResult, useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";
import { DatabaseSaveException } from "../../exceptions/DatabaseSaveException";
import { Document } from "../../models/Document/Document";
import { DatabaseDocumentDto } from "../../models/Document/Document.dto";
import { ImageService } from "../../services/ImageService";

export interface IDocumentRepositoryProps {
  ownerId: string;
}

export function useDocumentRepository({ ownerId }: IDocumentRepositoryProps) {
  const db = useSQLiteContext();

  const getAllDocuments = useCallback(async (): Promise<Document[]> => {
    const query = `SELECT * FROM documents WHERE owner_id = ?`;
    const result = await db.getAllAsync<DatabaseDocumentDto>(query, [ownerId]);
    const documents: Document[] = result.map((doc) => Document.toModel(doc));
    return documents;
  }, [db, ownerId]);

  const getDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    const query = `SELECT * FROM documents WHERE id = ? AND owner_id = ?`;
    const result = await db.getFirstAsync<DatabaseDocumentDto>(query, [id, ownerId]);
    if (result) {
      return Document.toModel(result);
    }
    return null;
  }, [db, ownerId]);

  const saveDocument = useCallback(async (document: Document): Promise<Document> => {
    let result: SQLiteExecuteAsyncResult<DatabaseDocumentDto>;
    const dbDocumentDto: DatabaseDocumentDto = Document.fromModel(document);
    if (dbDocumentDto.id) {
      // UPDATE
      const statement = await db.prepareAsync(
        `UPDATE documents SET 
            name = $name, 
            filename = $filename, 
            type = $type,
            mimetype = $mimetype,
            file_path = $file_path, 
            file_source = $file_source, 
            owner_id = $owner_id
          WHERE id = $id AND owner_id = $owner_id`
      );
      result = await statement.executeAsync({
        $id: dbDocumentDto.id,
        $name: dbDocumentDto.name,
        $filename: dbDocumentDto.filename,
        $type: dbDocumentDto.type,
        $mimetype: dbDocumentDto.mimetype,
        $file_path: dbDocumentDto.file_path,
        $file_source: dbDocumentDto.file_source,
        $owner_id: ownerId
      });
      if (result.changes === 0) {
        throw new DatabaseSaveException(`Document with id ${dbDocumentDto.id} not found or not owned by user ${dbDocumentDto.owner_id}`);
      }
    } else {
      // INSERT
      document.id = Document.generateId(); // Ensure we have an ID for the new document
      const statement = await db.prepareAsync(
        `INSERT INTO documents (id, name, filename, type, file_path, file_source, owner_id, mimetype) 
          VALUES ($id, $name, $filename, $type, $file_path, $file_source, $owner_id, $mimetype)`
      );
      result = await statement.executeAsync({
        $id: document.id,
        $name: dbDocumentDto.name,
        $filename: dbDocumentDto.filename,
        $type: dbDocumentDto.type,
        $file_path: dbDocumentDto.file_path,
        $file_source: dbDocumentDto.file_source,
        $mimetype: dbDocumentDto.mimetype,
        $owner_id: ownerId
      });
      if (result.changes === 0) {
        throw new DatabaseSaveException(`Failed to save document for user ${dbDocumentDto.owner_id}`);
      }
    }
    return document;
  }, [db, ownerId]);

  const deleteDocumentById = useCallback(async (id: string): Promise<void> => {
    const query = `DELETE FROM documents WHERE id = ? AND owner_id = ?`;
    const statement = await db.prepareAsync(query);
    const result = await statement.executeAsync([id, ownerId]);
    if (result.changes === 0) {
      throw new DatabaseSaveException(`Failed to delete document with id ${id} for user ${ownerId}`);
    }
  }, [db, ownerId]);

  const attachDocumentToItem = useCallback(async (documentId: string, itemId: string): Promise<SQLiteExecuteAsyncResult<any>> => {
    const documentAttachmentId = Document.generateId();
    const query = `INSERT INTO document_attachments (id, entity_id, document_id, model) VALUES (?, ?, ?, ?)`;
    const statement = await db.prepareAsync(query);
    const result = await statement.executeAsync([documentAttachmentId, itemId, documentId, 'Item']);
    if (result.changes === 0) {
      throw new DatabaseSaveException(`Failed to attach document ${documentId} to item ${itemId}`);
    }
    return result;
  }, [db]);

  const detachDocumnentFromItem = useCallback(async (documentId: string, itemId: string) => {
    const query = `DELETE FROM document_attachments WHERE entity_id = ? AND document_id = ? AND model = 'Item'`;
    const statement = await db.prepareAsync(query);
    const result = await statement.executeAsync([itemId, documentId]);
    if (result.changes === 0) {
      throw new DatabaseSaveException(`Failed to attach document ${documentId} to item ${itemId}`);
    }
    return result;
  }, [db]);

  const getAllDocumentsForItem = useCallback(async (itemId: string): Promise<Document[]> => {
    const query = `SELECT
            documents.*,
            document_attachments.model as "entity_model",
            document_attachments.entity_id as "entity_id"
          FROM documents
            INNER JOIN document_attachments ON documents.id = document_attachments.document_id
            WHERE document_attachments.entity_id = ? AND document_attachments.model = 'Item'`;
    const result = await db.getAllAsync<DatabaseDocumentDto>(query, [itemId]);
    return result.map((doc) => Document.toModel(doc));
  }, [db]);

  /**
   * Remove all documents that are not attachments
   */
  const ghostbuster = useCallback(async () => {
    // Find all orphaned documents for this owner
    const orphanedDocsQuery = `
      SELECT * FROM documents 
      WHERE id NOT IN (SELECT document_id FROM document_attachments) 
      AND owner_id = ?
    `;
    const orphanedDocs = await db.getAllAsync<DatabaseDocumentDto>(orphanedDocsQuery, [ownerId]);
    for (const doc of orphanedDocs) {
      if (doc.file_source === 'local' && doc.file_path) {
      try {
        await ImageService.deleteImage(doc.file_path);
      } catch (err) {
        console.warn(`Failed to remove file at ${doc.file_path}:`, err);
      }
      }
    }
    const query = `DELETE FROM documents WHERE id NOT IN (SELECT document_id FROM document_attachments) AND owner_id = ?`;
    const request = await db.prepareAsync(query);
    const result = await request.executeAsync([ownerId]);
    if (result.changes > 0) {
      const message = `Who you gonna call? Ghostbusters 👻 ! Removed ${result.changes} orphaned documents.`;
      const border = "─".repeat(message.length + 2);
      console.log(`┌${border}┐`);
      console.log(`│ ${message} │`);
      console.log(`└${border}┘`);
    }
  }, [db, ownerId]);

  return {
    saveDocument,
    getAllDocuments,
    getDocumentById,
    attachDocumentToItem,
    detachDocumnentFromItem,
    getAllDocumentsForItem,
    deleteDocumentById,
    ghostbuster
  };
}
