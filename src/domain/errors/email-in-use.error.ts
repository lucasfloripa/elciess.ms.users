export class EmailInUseError extends Error {
  error: string
  constructor() {
    super('EmailInUseError')
    this.name = 'EmailInUse'
    this.error = 'Email already registred'
  }
}
