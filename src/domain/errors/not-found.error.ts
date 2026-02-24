export class NotFoundError extends Error {
  error: string
  constructor(message: string) {
    super(message)
    this.name = 'NotFound'
    this.error = message
  }
}
