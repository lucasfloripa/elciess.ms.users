import { AuthorizationUsecase } from '@/application/usecases'
import { PermissionService } from '@/infra/services'
import { WinstonLogger } from '@/infra/winstom'

export const makeAuthorizationUsecase = (): AuthorizationUsecase => {
  const logger = new WinstonLogger()
  const permissionService = new PermissionService()
  const usecase = new AuthorizationUsecase(permissionService, logger)
  return usecase
}
