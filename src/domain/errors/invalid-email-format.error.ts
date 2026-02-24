export class InvalidEmailFormatError extends Error {
  error: string
  constructor() {
    super('InvalidEmailFormatError')
    this.name = 'InvalidEmailFormat'
    this.error = 'Invalid email format'
  }
}
