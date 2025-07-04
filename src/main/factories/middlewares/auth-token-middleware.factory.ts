import { makeAuthTokenUsecase } from '@/main/factories/usecases'
import { AuthTokenMiddleware } from '@/presentation/middlewares'

export const makeAuthTokenMiddleware = (): AuthTokenMiddleware => {
  const usecase = makeAuthTokenUsecase()
  const middleware = new AuthTokenMiddleware(usecase)
  return middleware
}
