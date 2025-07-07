import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '@/presentation/validators'

export const makeGetMeValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  validations.push(new RequiredFieldValidation('userId'))

  return new ValidationComposite(validations)
}
