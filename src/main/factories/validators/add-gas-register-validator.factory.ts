import { type IValidation } from '@/presentation/contracts'
import {
  ValidationComposite,
  RequiredFieldValidation,
  DateValidation
} from '@/presentation/validators'

export const makeAddGasRegisterValidator = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['price', 'actualKm', 'date']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new DateValidation())

  return new ValidationComposite(validations)
}
