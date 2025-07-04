import { makeAuthRoleUsecase } from '@/main/factories/usecases'
import { AuthRoleMiddleware } from '@/presentation/middlewares'

export const makeAuthRoleMiddleware = (
  requiredRole: string
): AuthRoleMiddleware => {
  const usecase = makeAuthRoleUsecase()
  const middleware = new AuthRoleMiddleware(usecase, requiredRole)
  return middleware
}
