import { WinstonLogger } from '@/infra/winstom'
import { makeAuthenticationUsecase } from '@/main/factories/usecases'
import { AuthenticationMiddleware } from '@/presentation/middlewares'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const logger = new WinstonLogger()
  const usecase = makeAuthenticationUsecase()
  const middleware = new AuthenticationMiddleware(usecase, logger)
  return middleware
}
