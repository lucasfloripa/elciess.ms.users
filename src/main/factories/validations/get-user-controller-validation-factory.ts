import { Validation } from '@src/presentation/protocols'
import { ValidationComposite, RequiredFieldValidation } from '@src/utils/validators'

export const makeGetUserControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['id']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
