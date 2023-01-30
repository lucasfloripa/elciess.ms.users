import { GetUserController } from '@src/presentation/controllers'
import { makeDbGetUserUseCase } from '@src/main/factories/usecases'
import { makeGetUserControllerValidation } from '@src/main/factories/validations'

export const makeGetUserController = (): GetUserController => {
  const getUserApplication = makeDbGetUserUseCase()
  const getUserControllerValidation = makeGetUserControllerValidation()
  return new GetUserController(getUserApplication, getUserControllerValidation)
}
