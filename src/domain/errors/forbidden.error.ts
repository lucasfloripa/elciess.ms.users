export class ForbiddenError extends Error {
  error: string
  constructor(message: string) {
    super('ForbiddenError')
    this.error = message
  }
}
