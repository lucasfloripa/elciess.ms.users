import { InvalidPasswordMatchError } from '@/domain/errors'
import { type IValidation } from '@/presentation/contracts'

export class ConfirmPasswordValidation implements IValidation {
  validate(input: any): Error | undefined {
    if (input.password !== input.confirmPassword) {
      return new InvalidPasswordMatchError()
    }
  }
}
