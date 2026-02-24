import { WinstonLogger } from '@/infra/winstom'
import { makeRoleGuardUsecase } from '@/main/factories/usecases'
import { RoleGuardMiddleware } from '@/presentation/middlewares'

export const makeRoleGuardMiddleware = (
  requiredRole: string
): RoleGuardMiddleware => {
  const logger = new WinstonLogger()
  const usecase = makeRoleGuardUsecase()
  const middleware = new RoleGuardMiddleware(usecase, requiredRole, logger)
  return middleware
}
