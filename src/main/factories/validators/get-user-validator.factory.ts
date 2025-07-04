import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '@/utils/validators'

export const makeGetUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  validations.push(new RequiredFieldValidation('id'))

  return new ValidationComposite(validations)
}
