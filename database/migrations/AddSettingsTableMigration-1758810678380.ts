import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class AddSettingsTableMigration1758810678380 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 7;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.createSettingsTable();
    await this.saveMigration(database);
  }

  private async createSettingsTable(): Promise<void> {
    if (!this.database) {
      throw new Error("Database connection is not established.");
    }
    const query = `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key VARCHAR(255) UNIQUE NOT NULL,
        label VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.database.execAsync(query);

    // Créer un index sur la colonne key pour améliorer les performances de recherche
    const indexQuery = `
      CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
    `;
    await this.database.execAsync(indexQuery);
  }
}