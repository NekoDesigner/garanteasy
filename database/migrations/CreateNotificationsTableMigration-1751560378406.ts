import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class CreateNotificationsTableMigration1751560378406 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 5;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    await this.createNotificationsTable();
    await this.saveMigration(database);
  }

  private async createNotificationsTable(): Promise<void> {
    if (!this.database) {
      throw new Error("Database connection is not established.");
    }

    await this.database.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        data TEXT,
        device_notification_id TEXT NOT NULL,
        scheduled_time TIMESTAMP NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on device_notification_id for faster lookups
    await this.database.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_notifications_device_notification_id 
      ON notifications (device_notification_id);
    `);
  }
}