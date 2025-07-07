import { WinstonLogger } from '@/infra/winstom'
import { makeAuthRoleUsecase } from '@/main/factories/usecases'
import { AuthRoleMiddleware } from '@/presentation/middlewares'

export const makeAuthRoleMiddleware = (
  requiredRole: string
): AuthRoleMiddleware => {
  const logger = new WinstonLogger()
  const usecase = makeAuthRoleUsecase()
  const middleware = new AuthRoleMiddleware(usecase, requiredRole, logger)
  return middleware
}
