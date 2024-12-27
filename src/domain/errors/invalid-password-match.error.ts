export class InvalidPasswordMatchError extends Error {
  error: string
  constructor() {
    super('InvalidPasswordMatchError')
    this.error = 'InvalidPasswordMatch'
  }
}
