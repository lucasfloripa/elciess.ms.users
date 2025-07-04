import { makeGetUsersUsecase } from '@/main/factories/usecases'
import { GetUsersController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeGetUsersController = (): IController => {
  const usecase = makeGetUsersUsecase()
  const controller: GetUsersController = new GetUsersController(usecase)
  return controller
}
