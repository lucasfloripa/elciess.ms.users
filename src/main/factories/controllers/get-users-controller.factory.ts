import { WinstonLogger } from '@/infra/winstom'
import { makeGetUsersUsecase } from '@/main/factories/usecases'
import { GetUsersController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeGetUsersController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeGetUsersUsecase()
  const controller: GetUsersController = new GetUsersController(usecase, logger)
  return controller
}
