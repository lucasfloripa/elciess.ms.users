import { RoleGuardUsecase } from '@/application/usecases'
import { WinstonLogger } from '@/infra/winstom'

export const makeRoleGuardUsecase = (): RoleGuardUsecase => {
  const logger = new WinstonLogger()
  const usecase = new RoleGuardUsecase(logger)
  return usecase
}
