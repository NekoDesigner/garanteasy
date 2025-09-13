import * as SQLite from 'expo-sqlite';
import DatabaseMigrationException from '../../exceptions/DatabaseMigrationException';
import { Migration } from "../migrate";

export class AddDescriptionColumnToHistoriesTableMigration1756657804230 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 6;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    console.log('Adding description column to histories table...');
    await this.createHistoriesTable();
    await this.saveMigration(database);
  }

  private async createHistoriesTable(): Promise<void> {
      if (!this.database) {
        throw new DatabaseMigrationException('Database is not available for migration.');
      }

    // Check if the column already exists
    const columnExists = await this.database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM pragma_table_info('histories') WHERE name = 'description'`
    );

    if (columnExists && columnExists.count > 0) {
      return;
    }

      await this.database.execAsync(`
      ALTER TABLE histories ADD COLUMN description TEXT DEFAULT NULL;
    `);
    }
}