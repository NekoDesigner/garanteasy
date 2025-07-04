import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'garenteasydb.db';

class Database {
  static db: SQLite.SQLiteDatabase | null = null;
  static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    if (!Database.db) {
      console.log('🏗️ Creating new database instance:', DATABASE_NAME);
      Database.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log('✅ Database instance created successfully');
    }
    return Database.db;
  }

  static async closeDatabase(): Promise<void> {
    if (Database.db) {
      await Database.db.closeAsync();
      Database.db = null;
    }
  }

  static async removeDatabase(): Promise<void> {
    // This method is now only used for manual cleanup
    // The reset logic is handled in _layout.tsx before SQLiteProvider opens the database
    if (Database.db) {
      await Database.closeDatabase();
    }

    try {
      await SQLite.deleteDatabaseAsync(DATABASE_NAME);
      console.log('✅ Database deleted successfully using SQLite.deleteDatabaseAsync');
    } catch (error) {
      console.error('Error deleting database:', error);
    }
  }
}

export default Database;
