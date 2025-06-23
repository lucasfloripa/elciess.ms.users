import { type IValidation } from '../../../presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '../../../utils/validators'

export const makeLogoutValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['userId']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
