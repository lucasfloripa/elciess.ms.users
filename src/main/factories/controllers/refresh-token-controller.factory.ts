import { WinstonLogger } from '@/infra/winstom'
import { makeRefreshTokenUsecase } from '@/main/factories/usecases'
import { makeRefreshTokenValidator } from '@/main/factories/validators'
import { RefreshTokenController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeRefreshTokenController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeRefreshTokenUsecase()
  const validator = makeRefreshTokenValidator()
  const controller: RefreshTokenController = new RefreshTokenController(
    usecase,
    validator,
    logger
  )
  return controller
}
