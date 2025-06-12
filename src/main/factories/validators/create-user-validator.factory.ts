import { type IValidation } from '../../../presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  ConfirmPasswordValidation,
  EmailValidation,
  UserTypeValidation
} from '../../../utils/validators'

export const makeCreateUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['email', 'password', 'confirmPassword', 'type']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation())
  validations.push(new ConfirmPasswordValidation())
  validations.push(new UserTypeValidation())

  return new ValidationComposite(validations)
}
