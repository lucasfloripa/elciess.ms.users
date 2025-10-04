export class InvalidDateFormatError extends Error {
  error: string
  constructor() {
    super('Invalid date format. Expected format: yyyy-mm-dd')
    this.error = 'InvalidDateFormatError'
  }
}
