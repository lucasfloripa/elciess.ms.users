export class ConflictError extends Error {
  error: string
  constructor(message: string) {
    super(message)
    this.name = 'Conflict'
    this.error = message
  }
}
