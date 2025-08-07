import * as SQLite from 'expo-sqlite';
import DatabaseMigrationException from '../exceptions/DatabaseMigrationException';

// Simple EventEmitter implementation for React Native
class EventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  addListener(event: string, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(...args));
    }
  }

  removeListener(event: string, listener: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
  }
}

/**
 * Interface for Migration
 * @interface IMigration
 * @property {number} currentVersion - The current version of the migration
 * @description This interface defines the structure for migration classes.
 * It includes the current version of the migration, which is used to determine
 * whether the migration should be applied based on the current database version.
 */
interface IMigration {
  currentVersion: number;
}

/**
 * Abstract class Migration
 * @extends EventEmitter
 * @implements {IMigration}
 * @description This abstract class provides a base for creating migrations.
 */
export abstract class Migration extends EventEmitter implements IMigration {
  abstract currentVersion: number;
  protected abstract database: SQLite.SQLiteDatabase | null;

  async run(db: SQLite.SQLiteDatabase): Promise<void> {
    this.database = db;
    if (!this.database) {
      throw new DatabaseMigrationException('Database is not available for migration.');
    }
    this.addListener('migration:after', async (version: number) => {
      await this.updateDatabaseVersion();
    });
    const before = await this.beforeMigrate();
    if (before.byPassMigration) {
      return;
    }
    await this.up(this.database);
    await this.afterMigrate();
  }

  protected abstract up(database: SQLite.SQLiteDatabase): Promise<void>

  private async beforeMigrate(): Promise<{ byPassMigration: boolean }> {
    const response = { byPassMigration: false };
    if (!(await this.isAvailableToMigrate())) {
      response.byPassMigration = true;
    }
    return response;
  }

  private async afterMigrate(): Promise<void> {
    this.emit('migration:after', this.currentVersion);
  }

  protected async getCurrentDatabaseVersion(): Promise<{ user_version: number }> {
    if (!this.database) {
      throw new Error('Database is not available for migration.');
    }
    let db_version = await this.database.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version'
    );
    if (!db_version) {
      db_version = { user_version: 0 };
    }
    return db_version;
  }

  protected async updateDatabaseVersion(): Promise<number> {
    if (!this.database) {
      throw new Error('Database is not available for migration.');
    }
    let db_version = await this.getCurrentDatabaseVersion();
    const newVersion = db_version.user_version + 1;
    await this.database.execAsync(`PRAGMA user_version = ${newVersion}`);
    return newVersion;
  }

  protected async isAvailableToMigrate(): Promise<boolean> {
    const db_version = await this.getCurrentDatabaseVersion();
    return db_version.user_version < this.currentVersion;
  }
}

export interface IMigrationOptions {
  migrations: Migration[];
  database: SQLite.SQLiteDatabase;
}

/**
 * Class Migrate
 * @description This class manages the execution of migrations.
 * It runs all migrations in the order they are defined, handling errors and logging.
 * @property {Migration[]} migrations - An array of migration instances to be executed.
 * @constructor
 * @param {Migration[]} [migrations] - Optional array of migration instances.
 * If not provided, it defaults to an array containing the initial migration.
 */
export class Migrate {
  private migrationOptions: Partial<IMigrationOptions> = {
    migrations: []
  };
  constructor(options: IMigrationOptions) {
    this.migrationOptions = { ...this.migrationOptions, ...options };
    if (!this.migrationOptions.database) {
      throw new Error('Database instance is required for migrations');
    }
  };
  async run(): Promise<void> {
    // order migrations by currentVersion low to high
    let { migrations, database } = this.migrationOptions;
    if (!migrations) {
      throw new Error('No migrations provided to run');
    }
    if (!database) {
      throw new Error('Database instance is required to run migrations');
    }
    // Note: resetDBOnInit is now handled in _layout.tsx before SQLiteProvider opens the database

    migrations = migrations.sort((a, b) => a.currentVersion - b.currentVersion);
    for (const migration of migrations) {
      try {
        if (await this.migrationIsAlreadyRunned(migration)) {
          continue; // Skip migration if it has already been run
        }
        await migration.run(database);
      } catch (error: unknown) {
        if (error instanceof DatabaseMigrationException) {
          console.error(`❌ Migration error: ${error.message}`);
        } else {
          console.error('❌ An unexpected error occurred during migration:', error);
        }
        throw error; // Re-throw the error to handle it outside if needed
      }
    }
  }

  private async migrationIsAlreadyRunned(migration: Migration): Promise<boolean> {
    if (!this.migrationOptions.database) {
      throw new Error('Database is not available for migration.');
    }
    // Check if migrations table exists first
    const migrationName = migration.constructor.name;

    // Check if migrations table exists
    const tableExists = await this.migrationOptions.database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='migrations'`
    );

    if (!tableExists || tableExists.count === 0) {
      // Migrations table doesn't exist yet, so no migrations have been run
      return false;
    }

    const query = `SELECT COUNT(*) as count FROM migrations WHERE name = ?`;
    const result = await this.migrationOptions.database.getFirstAsync<{ count: number }>(query, [migrationName]);
    if (result && result.count > 0) {
      return true;
    }
    return false;
  }
}