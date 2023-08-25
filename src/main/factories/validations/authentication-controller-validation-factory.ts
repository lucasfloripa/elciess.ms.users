import { Validation } from '../../../presentation/protocols'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../utils/validators'
import { EmailValidatorAdapter } from '../../../infra/validators'
import { ConfirmPasswordValidation } from '../../../utils/validators/confirm-password-validation'

export const makeCreateUserControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new ConfirmPasswordValidation())
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
