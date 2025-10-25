import * as SQLite from 'expo-sqlite';
import { Migration } from "../migrate";

export class UpdateCategoriesTableMigration1761404688363 extends Migration {
  protected database: SQLite.SQLiteDatabase | null = null;
  currentVersion = 9;

  protected async up(database: SQLite.SQLiteDatabase): Promise<void> {
    this.database = database;
    await this.database.execAsync(`PRAGMA foreign_keys = ON;`);
    // Mise à jour du nom de la catégorie par défaut "Électroménager" en "Gros électroménager"
    await this.UpdateDefaultCategory1();
    await this.saveMigration(database);
  }

  private async UpdateDefaultCategory1(): Promise<void> {
    if (!this.database) {
      throw new Error("Database connection is not established.");
    }
    const query = `
      UPDATE categories
      SET name = ?
      WHERE id = ?;
    `;
    try {
      await this.database.runAsync(query, ['Gros électroménager', 'default-category-1']);
      await this.database.runAsync(query, ['Petit électroménager', 'default-category-2']);
    } catch {}
  }
}