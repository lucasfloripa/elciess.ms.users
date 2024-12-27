export class InvalidEmailFormatError extends Error {
  error: string
  constructor() {
    super('InvalidEmailFormatError')
    this.error = 'InvalidEmailFormat'
  }
}
