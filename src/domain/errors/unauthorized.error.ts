export class UnauthorizedError extends Error {
  error: string
  constructor(message: string) {
    super(message)
    this.name = 'Unauthorized'
    this.error = message
  }
}
