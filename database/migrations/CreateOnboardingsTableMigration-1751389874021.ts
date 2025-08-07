import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class CreateOnboardingsTableMigration1751389874021 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 4;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.createOnboardingsTable();
    await this.addFirstOnboarding();
  }

  private createOnboardingsTable(): Promise<void> {
    return this.database!.execAsync(`
      CREATE TABLE IF NOT EXISTS onboardings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  private async addFirstOnboarding(): Promise<void> {
    const query = `
      INSERT INTO onboardings (name, is_completed)
      VALUES ('initial_onboarding', 0);
    `;
    await this.database!.execAsync(query);
  }
}