import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  ConfirmPasswordValidation,
  EmailValidation
} from '@/utils/validators'

export const makeCreateUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['email', 'password', 'confirmPassword']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation())
  validations.push(new ConfirmPasswordValidation())

  return new ValidationComposite(validations)
}
