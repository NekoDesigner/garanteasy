export class DatabaseSaveException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseSaveException";
  }
}