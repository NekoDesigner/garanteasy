export class DatabaseValidatorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseValidatorException";
  }
}
