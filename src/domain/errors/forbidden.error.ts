export class ForbiddenError extends Error {
  error: string
  constructor() {
    super('ForbiddenError')
    this.error = 'Forbidden'
  }
}
