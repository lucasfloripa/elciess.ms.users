import { WinstonLogger } from '@/infra/winstom'
import { makeAuthTokenUsecase } from '@/main/factories/usecases'
import { AuthTokenMiddleware } from '@/presentation/middlewares'

export const makeAuthTokenMiddleware = (): AuthTokenMiddleware => {
  const logger = new WinstonLogger()
  const usecase = makeAuthTokenUsecase()
  const middleware = new AuthTokenMiddleware(usecase, logger)
  return middleware
}
