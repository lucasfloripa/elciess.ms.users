import { type IValidation } from '../../../presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '../../../utils/validators'

export const makePasswordResetValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['email']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation())

  return new ValidationComposite(validations)
}
