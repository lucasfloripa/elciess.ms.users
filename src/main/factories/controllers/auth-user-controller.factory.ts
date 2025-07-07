import { WinstonLogger } from '@/infra/winstom'
import { makeAuthUserUsecase } from '@/main/factories/usecases'
import { makeAuthUserValidator } from '@/main/factories/validators'
import { AuthUserController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeAuthUserController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeAuthUserUsecase()
  const validator = makeAuthUserValidator()
  const controller: AuthUserController = new AuthUserController(
    usecase,
    validator,
    logger
  )
  return controller
}
