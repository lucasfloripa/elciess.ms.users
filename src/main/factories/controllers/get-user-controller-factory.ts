import { GetUserController } from '../../../presentation/controllers'
import { makeDbGetUserUseCase } from '../../../main/factories/usecases'
import { makeGetUserControllerValidation } from '../../../main/factories/validations'

export const makeGetUserController = (): GetUserController => {
  const getUserApplication = makeDbGetUserUseCase()
  const getUserControllerValidation = makeGetUserControllerValidation()
  return new GetUserController(getUserApplication, getUserControllerValidation)
}
