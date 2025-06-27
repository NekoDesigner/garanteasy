import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class AddBrandColumnToItemsTableMigration1751057246774 extends Migration {
  private database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 2;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.addBrandColumn();
  }

  async addBrandColumn() {
    if (!this.database) {
      throw new Error('Database is not available for migration.');
    }
    // Check if the column already exists
    const columnExists = await this.database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM pragma_table_info('items') WHERE name = 'brand'`
    );

    if (columnExists && columnExists.count > 0) {
      console.log('Column "brand" already exists in "items" table.');
      return;
    }

    // Add the brand column to the items table
    await this.database.execAsync(`
      ALTER TABLE items ADD COLUMN brand VARCHAR(255) DEFAULT NULL;
    `);
  }
}