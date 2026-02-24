export class MissingParamError extends Error {
  error: string
  constructor(param: string) {
    super('MissingParamError')
    this.name = 'MissingParam'
    this.error = `Missing param: ${param}`
  }
}
