export default class DatabaseMigrationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseMigrationException';
    Object.setPrototypeOf(this, DatabaseMigrationException.prototype);
  }
}
