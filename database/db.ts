import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'garenteasydb.db';

class Database {
  static db: SQLite.SQLiteDatabase | null = null;
  static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    if (!Database.db) {
      Database.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    }
    return Database.db;
  }
}

export default Database;
