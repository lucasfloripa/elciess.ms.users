import { WinstonLogger } from '@/infra/winstom'
import { makeLogoutUsecase } from '@/main/factories/usecases'
import { LogoutController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeLogoutController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeLogoutUsecase()
  const controller: LogoutController = new LogoutController(usecase, logger)
  return controller
}
