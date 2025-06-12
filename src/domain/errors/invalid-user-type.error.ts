export class InvalidUserTypeError extends Error {
  constructor() {
    super('Invalid user type. Must be "client" or "admin".')
    this.name = 'InvalidUserTypeError'
  }
}
