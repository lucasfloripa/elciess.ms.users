export class EmailInUseError extends Error {
  error: string
  constructor() {
    super('EmailInUseError')
    this.error = 'Email already registred'
  }
}
