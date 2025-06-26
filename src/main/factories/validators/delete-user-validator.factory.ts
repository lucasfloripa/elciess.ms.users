import { type IValidation } from '../../../presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '../../../utils/validators'

export const makeDeleteUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['id']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
