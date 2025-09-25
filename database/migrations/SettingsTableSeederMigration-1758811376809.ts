import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class SettingsTableSeederMigration1758811376809 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 8;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.insertDefaultSettings();
    await this.saveMigration(database);
  }

  private async insertDefaultSettings(): Promise<void> {
    if (!this.database) {
      throw new Error("Database connection is not established.");
    }
    const query = `
      INSERT INTO settings (key, label, value)
      VALUES (?, ?, ?);
    `;
    const defaultSettings = [
      { key: 'notifications_enabled', label: 'Activer les notifications', value: 'true' },
      // Add more default settings as needed
    ];

    for (const setting of defaultSettings) {
      try {
        await this.database.runAsync(query, [setting.key, setting.label, setting.value]);
      } catch {}
    }
  }
}