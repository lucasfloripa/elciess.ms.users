export class MissingParamError extends Error {
  error: string
  constructor(param: string) {
    super('MissingParamError')
    this.error = `Missing param: ${param}`
  }
}
