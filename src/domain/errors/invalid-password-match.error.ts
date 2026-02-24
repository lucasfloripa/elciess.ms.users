export class InvalidPasswordMatchError extends Error {
  error: string
  constructor() {
    super('InvalidPasswordMatchError')
    this.name = 'InvalidPasswordMatch'
    this.error = 'Password dont match confirmPassword'
  }
}
