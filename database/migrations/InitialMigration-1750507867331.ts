import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';
import DatabaseMigrationException from '../../exceptions/DatabaseMigrationException';
import { Migration } from "../migrate";

export class InitialMigration1750507867331 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 1;
  private ownerId: string;

  constructor() {
    super();
    this.ownerId = uuid.v4();
  }

  // Override isAvailableToMigrate for initial migration since migrations table doesn't exist yet
  protected async isAvailableToMigrate(): Promise<boolean> {
    if (!this.database) {
      throw new Error('Database is not available for migration.');
    }

    // Check if migrations table exists first
    const tableExists = await this.database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='migrations'`
    );

    if (!tableExists || tableExists.count === 0) {
      // Migrations table doesn't exist yet, so this initial migration should run
      return true;
    }

    // If migrations table exists, check if this specific migration has been run
    const migration = await this.getDatabaseMigration();
    if (migration) {
      // Migration has already been run
      return false;
    }
    return true;
  }

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;

    // Enable foreign keys and set WAL mode
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.database.execAsync(`PRAGMA journal_mode = 'wal';`);

    await this.createMigrationTable();

    // Save the migration record after creating the migrations table
    await this.saveMigration(this.database);

    await this.createOwnersTable();
    await this.createCategoriesTable();
    await this.createDocumentsTable();
    await this.createDocumentAttachmentsTable();
    await this.createHistoriesTable();
    await this.createItemsTable();
  }

  private async createMigrationTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    // Create migrations table
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        version INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  private async createOwnersTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS owners (
        id VARCHAR(125) PRIMARY KEY NOT NULL,
        unikode VARCHAR(10) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // create current owner
    await this.database.execAsync(`
      INSERT INTO owners (id, unikode, created_at, updated_at)
      VALUES ('${this.ownerId}', '${this.generateUnikode()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);
  }
  private async createCategoriesTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(125) PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        owner_id VARCHAR(125) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
      );
    `);

    // Insert default categories only if they don't already exist
    const defaultCategories = [
      { id: 'default-category-1', name: 'Électroménagé' },
      { id: 'default-category-2', name: 'Petit éléctroménagé' },
      { id: 'default-category-3', name: 'Bricolage' },
      { id: 'default-category-4', name: 'Jardin' },
      { id: 'default-category-5', name: 'Mode' },
      { id: 'default-category-6', name: 'Multimédia' },
      { id: 'default-category-7', name: 'Autre' },
    ];

    for (const category of defaultCategories) {
      try {
        await this.database.execAsync(`
          INSERT INTO categories (id, name, owner_id, created_at, updated_at)
          VALUES ('${category.id}', '${category.name}', '${this.ownerId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes('UNIQUE constraint failed')) {
            console.warn(`Category with id '${category.id}' already exists. Skipping insertion.`);
          } else {
            throw error;
          }
        }
      }
    }
  }
  private async createDocumentsTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(125) PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        mimetype VARCHAR(50) NOT NULL,
        file_path TEXT NOT NULL,
        file_source VARCHAR(50) NOT NULL,
        owner_id VARCHAR(125) NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
      );
    `);
  }
  private async createDocumentAttachmentsTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS document_attachments (
        id VARCHAR(125) PRIMARY KEY NOT NULL,
        document_id VARCHAR(125) NOT NULL,
        entity_id VARCHAR(125) NOT NULL,
        model VARCHAR(50) DEFAULT 'Item',
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
      );
    `);
  }
  private async createHistoriesTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS histories (
        id VARCHAR(125) PRIMARY KEY NOT NULL,
        item_id VARCHAR(125) NOT NULL,
        label VARCHAR(255) NOT NULL,
        intervention_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
      );
    `);
  }
  private async createItemsTable(): Promise<void> {
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }

    // Create the items table
    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS items (
        id VARCHAR(125) PRIMARY KEY NOT NULL, 
        owner_id VARCHAR(125) NOT NULL,
        label TEXT NOT NULL, 
        category_id VARCHAR(125) NOT NULL,
        picture TEXT,
        purchase_date TIMESTAMP,
        warranty_duration VARCHAR(50),
        memo TEXT,
        is_archived BOOLEAN NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    // Then, create the trigger separately
    await this.database.execAsync(`
      CREATE TRIGGER IF NOT EXISTS update_category_on_delete
      AFTER DELETE ON categories
      BEGIN
        UPDATE items
        SET category_id = 'default-category-7'
        WHERE category_id = OLD.id;
      END;
    `);
  }

  private generateUnikode(): string {
    const prefix = 'GE';
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomPart}`;
  }
}