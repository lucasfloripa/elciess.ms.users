import { AuthTokenMiddleware } from '../../../presentation/middlewares'
import { makeAuthTokenUsecase } from '../usecases'

export const makeAuthTokenMiddleware = (): AuthTokenMiddleware => {
  const usecase = makeAuthTokenUsecase()
  const middleware = new AuthTokenMiddleware(usecase)
  return middleware
}
