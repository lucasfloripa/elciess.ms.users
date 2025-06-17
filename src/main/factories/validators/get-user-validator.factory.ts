import { type IValidation } from '../../../presentation/contracts'
import {
  ValidationComposite,
  OneFieldValidation
} from '../../../utils/validators'

export const makeGetUserValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  validations.push(new OneFieldValidation(['email', 'userId', 'userType']))

  return new ValidationComposite(validations)
}
