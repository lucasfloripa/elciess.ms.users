import { WinstonLogger } from '@/infra/winstom'
import { makeAuthorizationUsecase } from '@/main/factories/usecases'
import { AuthorizationMiddleware } from '@/presentation/middlewares'

export const makeAuthorizationMiddleware = (): AuthorizationMiddleware => {
  const logger = new WinstonLogger()
  const usecase = makeAuthorizationUsecase()
  const middleware = new AuthorizationMiddleware(usecase, logger)
  return middleware
}
