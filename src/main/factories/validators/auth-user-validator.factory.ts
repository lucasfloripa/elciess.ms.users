import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/utils/validators'

export const makeAuthUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation())
  return new ValidationComposite(validations)
}
