export class UnauthorizedError extends Error {
  error: string
  constructor() {
    super('UnauthorizedError')
    this.error = 'Unauthorized'
  }
}
