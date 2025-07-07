import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  ConfirmPasswordValidation
} from '@/presentation/validators'

export const makeUpdateUserPasswordUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of [
    'userId',
    'password',
    'confirmPassword',
    'newPassword'
  ]) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new ConfirmPasswordValidation())

  return new ValidationComposite(validations)
}
