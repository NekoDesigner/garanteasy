import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class AddTypeColumnFromDocumentTableMigration1751223578383 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 3;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.addTypeColumn();
  }

  async addTypeColumn() {
    if (!this.database) {
      throw new Error('Database is not available for migration.');
    }

    // Check if the column already exists
    const result = this.database.getAllSync(
      `PRAGMA table_info(documents);`
    );

    const columnExists = result.some((col: any) => col.name === 'type');

    if (!columnExists) {
      await this.database.execAsync(`
        ALTER TABLE documents ADD COLUMN type TEXT DEFAULT 'invoice';
      `);
    } else {
    }
  }
}