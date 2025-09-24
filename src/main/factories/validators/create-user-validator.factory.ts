import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  ConfirmPasswordValidation,
  EmailValidation
} from '@/presentation/validators'

export const makeCreateUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['email', 'password', 'confirmPassword']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation(), new ConfirmPasswordValidation())

  return new ValidationComposite(validations)
}
