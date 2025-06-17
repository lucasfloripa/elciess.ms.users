export class NotFoundError extends Error {
  error: string
  constructor(message: string) {
    super('NotFoundError')
    this.error = message
  }
}
