export class ForbiddenError extends Error {
  error: string
  constructor(message: string) {
    super(message)
    this.name = 'Forbidden'
    this.error = message
  }
}
