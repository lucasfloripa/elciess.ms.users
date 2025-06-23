export class ConflictError extends Error {
  error: string
  constructor(message: string) {
    super('ConflictError')
    this.error = message
  }
}
