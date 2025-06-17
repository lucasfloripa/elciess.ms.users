import { type IValidation } from '../../../presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '../../../utils/validators'

export const makeRefreshTokenValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['refreshToken']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
