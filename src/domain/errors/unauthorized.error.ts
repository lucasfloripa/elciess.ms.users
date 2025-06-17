export class UnauthorizedError extends Error {
  error: string
  constructor(message: string) {
    super('UnauthorizedError')
    this.error = message
  }
}
