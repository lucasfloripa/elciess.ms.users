import { Validation } from '../../../src/presentation/protocols'

export const mockValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new Error()
    }
  }
  return new ValidationStub()
}
