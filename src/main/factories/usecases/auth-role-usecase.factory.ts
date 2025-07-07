import { AuthRoleUsecase } from '@/application/usecases'
import { WinstonLogger } from '@/infra/winstom'

export const makeAuthRoleUsecase = (): AuthRoleUsecase => {
  const logger = new WinstonLogger()
  const usecase = new AuthRoleUsecase(logger)
  return usecase
}
