import { AuthenticationController } from '../../../presentation/controllers'
import { makeDbAuthUserRepository } from '../../../main/factories/usecases'
import { makeAuthenticationControllerValidation } from '../../../main/factories/validations'

export const makeAuthenticationController = (): AuthenticationController => {
  const inputValidator = makeAuthenticationControllerValidation()
  const usecase = makeDbAuthUserRepository()
  return new AuthenticationController(usecase, inputValidator)
}
