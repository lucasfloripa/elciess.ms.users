import { GetUsersController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeGetUsersUsecase } from '../usecases'

export const makeGetUsersController = (): IController => {
  const usecase = makeGetUsersUsecase()
  const controller: GetUsersController = new GetUsersController(usecase)
  return controller
}
