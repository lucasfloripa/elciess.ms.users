import { WinstonLogger } from '@/infra/winstom'
import { makeLoginUsecase } from '@/main/factories/usecases'
import { makeLoginValidator } from '@/main/factories/validators'
import { LoginController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeLoginController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeLoginUsecase()
  const validator = makeLoginValidator()
  const controller: LoginController = new LoginController(
    usecase,
    validator,
    logger
  )
  return controller
}
