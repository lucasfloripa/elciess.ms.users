import { AuthRoleMiddleware } from '../../../presentation/middlewares'
import { makeAuthRoleUsecase } from '../usecases'

export const makeAuthRoleMiddleware = (
  requiredRole: string
): AuthRoleMiddleware => {
  const usecase = makeAuthRoleUsecase()
  const middleware = new AuthRoleMiddleware(usecase, requiredRole)
  return middleware
}
