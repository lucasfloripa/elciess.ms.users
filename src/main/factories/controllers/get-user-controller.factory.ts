import { GetUserController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeGetUserUsecase } from '../usecases'
import { makeGetUserValidator } from '../validators'

export const makeGetUserController = (): IController => {
  const usecase = makeGetUserUsecase()
  const validator = makeGetUserValidator()
  const controller: GetUserController = new GetUserController(
    usecase,
    validator
  )
  return controller
}
