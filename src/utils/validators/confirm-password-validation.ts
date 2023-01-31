import { Validation } from '../../presentation/protocols'
import { InvalidParamError } from '../../presentation/errors'

export class ConfirmPasswordValidation implements Validation {
  validate (input: any): Error | undefined {
    if (input.password !== input.confirmPassword) {
      return new InvalidParamError('password dont match confirmPassword.')
    }
  }
}
